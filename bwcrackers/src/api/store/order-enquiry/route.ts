import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ORDER_ENQUIRY_MODULE } from "../../../modules/order-enquiry"
import OrderEnquiryModuleService from "../../../modules/order-enquiry/service"
import { sendOrderEnquiryEmail } from "../../../lib/order-email"
import { priceItems, PricingError, RequestedItem } from "../../../lib/pricing"
import { clientIp, isRateLimited } from "../../../lib/rate-limit"
import { normalizeIndianPhone, referenceFromId } from "../../../lib/order-reference"

const MAX_ITEMS = 200
const MAX_QTY = 999
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 10 * 60 * 1000

type Body = {
  customer_name?: unknown
  phone?: unknown
  email?: unknown
  address?: unknown
  city?: unknown
  state?: unknown
  pincode?: unknown
  notes?: unknown
  items?: unknown
}

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, max) : null
}

function parseItems(raw: unknown): RequestedItem[] | string {
  if (!Array.isArray(raw) || raw.length === 0) return "Add at least one item to your order."
  if (raw.length > MAX_ITEMS) return `An order can contain at most ${MAX_ITEMS} different items.`

  const items: RequestedItem[] = []
  for (const entry of raw) {
    const code = typeof entry?.code === "string" ? entry.code.trim() : ""
    const quantity = Number(entry?.quantity)
    if (!code || !/^[A-Za-z0-9-]{1,16}$/.test(code)) return "One of the items has an invalid code."
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) {
      return `Quantity for item ${code} must be between 1 and ${MAX_QTY}.`
    }
    items.push({ code, quantity })
  }
  return items
}

export async function POST(req: MedusaRequest<Body>, res: MedusaResponse) {
  if (isRateLimited(`order-enquiry:${clientIp(req)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return res.status(429).json({
      message: "Too many orders from this connection. Please wait a few minutes or WhatsApp us directly.",
    })
  }

  const body = (req.body ?? {}) as Body

  const customer_name = text(body.customer_name, 120)
  if (!customer_name || customer_name.length < 2) {
    return res.status(400).json({ message: "Please enter your name." })
  }

  const phone = typeof body.phone === "string" ? normalizeIndianPhone(body.phone) : null
  if (!phone) {
    return res.status(400).json({ message: "Phone must be a valid 10-digit Indian mobile number." })
  }

  const email = text(body.email, 160)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Email address looks invalid." })
  }

  const pincode = text(body.pincode, 6)
  if (pincode && !/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ message: "Pincode must be 6 digits." })
  }

  const parsed = parseItems(body.items)
  if (typeof parsed === "string") {
    return res.status(400).json({ message: parsed })
  }

  let priced
  try {
    priced = await priceItems(req.scope, parsed)
  } catch (err) {
    if (err instanceof PricingError) {
      return res.status(400).json({ message: err.message, unknown_codes: err.unknownCodes })
    }
    throw err
  }

  const service: OrderEnquiryModuleService = req.scope.resolve(ORDER_ENQUIRY_MODULE)
  const enquiry = await service.createOrderEnquiries({
    customer_name,
    phone,
    email,
    address: text(body.address, 400),
    city: text(body.city, 80),
    state: text(body.state, 80),
    pincode,
    notes: text(body.notes, 600),
    items: priced.items.map(({ code, title, variant_title, quantity, unit_price }) => ({
      code,
      title,
      variant_title,
      quantity,
      unit_price,
    })),
    subtotal: priced.subtotal,
    packing_fee: priced.packing_fee,
    grand_total: priced.grand_total,
    currency_code: "inr",
    status: "pending",
  })

  const reference = referenceFromId(enquiry.id)

  // Notify the store team. A mail failure must never block the order.
  try {
    await sendOrderEnquiryEmail({
      id: enquiry.id,
      reference,
      customer_name,
      phone,
      email,
      address: enquiry.address,
      city: enquiry.city,
      state: enquiry.state,
      pincode: enquiry.pincode,
      notes: enquiry.notes,
      items: priced.items,
      subtotal: priced.subtotal,
      packing_fee: priced.packing_fee,
      grand_total: priced.grand_total,
      currency_code: "inr",
    })
  } catch (err) {
    console.error("[order-enquiry] Failed to send notification email:", err)
  }

  res.status(201).json({
    order_enquiry: {
      id: enquiry.id,
      status: enquiry.status,
      subtotal: priced.subtotal,
      packing_fee: priced.packing_fee,
      grand_total: priced.grand_total,
      items: priced.items,
      created_at: enquiry.created_at,
    },
    reference,
    subtotal: priced.subtotal,
    packing_fee: priced.packing_fee,
    grand_total: priced.grand_total,
  })
}
