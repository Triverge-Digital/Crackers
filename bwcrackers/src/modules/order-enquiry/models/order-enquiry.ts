import { model } from "@medusajs/framework/utils"

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
  currency_code: model.text().default("inr"),
  status: model.text().default("pending"),
})

export default OrderEnquiry
