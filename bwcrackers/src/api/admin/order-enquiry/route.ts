import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ORDER_ENQUIRY_MODULE } from "../../../modules/order-enquiry"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const orderEnquiryService = req.scope.resolve(ORDER_ENQUIRY_MODULE)

  const enquiries = await orderEnquiryService.listOrderEnquiries(
    {},
    { order: { created_at: "DESC" } }
  )

  res.json({ order_enquiries: enquiries })
}
