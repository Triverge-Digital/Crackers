import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ORDER_ENQUIRY_MODULE } from "../../../../modules/order-enquiry"
import OrderEnquiryModuleService from "../../../../modules/order-enquiry/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const orderEnquiryService: OrderEnquiryModuleService = req.scope.resolve(ORDER_ENQUIRY_MODULE)
  const id = req.params.id

  const enquiry = await orderEnquiryService.retrieveOrderEnquiry(id)

  res.json({ order_enquiry: enquiry })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const orderEnquiryService: OrderEnquiryModuleService = req.scope.resolve(ORDER_ENQUIRY_MODULE)
  const id = req.params.id
  const { status } = req.body as { status: string }

  const enquiry = await orderEnquiryService.updateOrderEnquiries({
    id,
    status,
  })

  res.json({ order_enquiry: enquiry })
}
