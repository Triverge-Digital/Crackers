import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ORDER_ENQUIRY_MODULE } from "../../../../modules/order-enquiry"
import OrderEnquiryModuleService from "../../../../modules/order-enquiry/service"
import { clientIp, isRateLimited } from "../../../../lib/rate-limit"
import {
  normalizeIndianPhone,
  normalizeReference,
  referenceFromId,
} from "../../../../lib/order-reference"

const NOT_FOUND =
  "We couldn't find an order with that reference and phone number. Check both and try again, or WhatsApp us."

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (isRateLimited(`track:${clientIp(req)}`, 30, 10 * 60 * 1000)) {
    return res.status(429).json({ message: "Too many lookups. Please wait a few minutes." })
  }

  const refParam = typeof req.query.ref === "string" ? normalizeReference(req.query.ref) : ""
  const phone = typeof req.query.phone === "string" ? normalizeIndianPhone(req.query.phone) : null

  if (!/^[0-9A-Z]{8}$/.test(refParam) || !phone) {
    return res.status(400).json({
      message: "Enter the 8-character order reference and the mobile number used to order.",
    })
  }

  const service: OrderEnquiryModuleService = req.scope.resolve(ORDER_ENQUIRY_MODULE)

  // ULIDs are upper-case in Medusa ids, but match case-insensitively to be safe.
  const candidates = await service.listOrderEnquiries(
    { phone, id: { $ilike: `%${refParam}` } },
    { take: 5, order: { created_at: "DESC" } }
  )
  const order = candidates.find((c) => referenceFromId(c.id) === refParam)

  if (!order) {
    return res.status(404).json({ message: NOT_FOUND })
  }

  const items = Array.isArray(order.items) ? (order.items as any[]) : []

  res.json({
    order: {
      reference: refParam,
      status: order.status,
      customer_name: order.customer_name,
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: items.map((it) => ({
        title: it.title,
        quantity: it.quantity,
        unit_price: it.unit_price,
      })),
      subtotal: order.subtotal,
      packing_fee: order.packing_fee ?? 0,
      grand_total: order.grand_total || order.subtotal + (order.packing_fee ?? 0),
      tracking_number: order.tracking_number ?? null,
    },
  })
}
