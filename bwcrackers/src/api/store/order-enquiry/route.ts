import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ORDER_ENQUIRY_MODULE } from "../../../modules/order-enquiry"
import OrderEnquiryModuleService from "../../../modules/order-enquiry/service"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const orderEnquiryService: OrderEnquiryModuleService = req.scope.resolve(ORDER_ENQUIRY_MODULE)

  const {
    customer_name,
    phone,
    email,
    address,
    city,
    state,
    pincode,
    notes,
    items,
    subtotal,
    currency_code,
  } = req.body as {
    customer_name: string
    phone: string
    email?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
    notes?: string
    items: any[]
    subtotal: number
    currency_code: string
  }

  if (!customer_name || !phone || !items || !items.length) {
    return res.status(400).json({
      message: "customer_name, phone, and items are required.",
    })
  }

  const phoneClean = phone.replace(/\s+/g, "")
  if (!/^\+91\d{10}$/.test(phoneClean)) {
    return res.status(400).json({
      message: "Phone must be a valid Indian number (+91XXXXXXXXXX).",
    })
  }

  const enquiry = await orderEnquiryService.createOrderEnquiries({
    customer_name,
    phone: phoneClean,
    email: email || null,
    address: address || null,
    city: city || null,
    state: state || null,
    pincode: pincode || null,
    notes: notes || null,
    items,
    subtotal,
    currency_code: currency_code || "inr",
    status: "pending",
  })

  res.status(201).json({ order_enquiry: enquiry })
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const orderEnquiryService: OrderEnquiryModuleService = req.scope.resolve(ORDER_ENQUIRY_MODULE)

  const enquiries = await orderEnquiryService.listOrderEnquiries(
    {},
    { order: { created_at: "DESC" } }
  )

  res.json({ order_enquiries: enquiries })
}
