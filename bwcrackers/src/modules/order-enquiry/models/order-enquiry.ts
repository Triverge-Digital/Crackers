import { model } from "@medusajs/framework/utils"

export const ORDER_ENQUIRY_STATUSES = [
  "pending",
  "confirmed",
  "paid",
  "packed",
  "dispatched",
  "delivered",
  "cancelled",
] as const

export type OrderEnquiryStatus = (typeof ORDER_ENQUIRY_STATUSES)[number]

const OrderEnquiry = model.define("order_enquiry", {
  id: model.id().primaryKey(),
  customer_name: model.text(),
  phone: model.text(),
  email: model.text().nullable(),
  address: model.text().nullable(),
  city: model.text().nullable(),
  state: model.text().nullable(),
  pincode: model.text().nullable(),
  notes: model.text().nullable(),
  items: model.json(),
  subtotal: model.float(),
  packing_fee: model.float().default(0),
  grand_total: model.float().default(0),
  currency_code: model.text().default("inr"),
  status: model.text().default("pending"),
  tracking_number: model.text().nullable(),
  admin_notes: model.text().nullable(),
})

export default OrderEnquiry
