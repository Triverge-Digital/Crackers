import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ORDER_ENQUIRY_MODULE } from "../../../modules/order-enquiry"
import OrderEnquiryModuleService from "../../../modules/order-enquiry/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const orderEnquiryService: OrderEnquiryModuleService = req.scope.resolve(ORDER_ENQUIRY_MODULE)

  const enquiries = await orderEnquiryService.listOrderEnquiries(
    {},
    { order: { created_at: "DESC" } }
  )

  res.json({ order_enquiries: enquiries })
}
