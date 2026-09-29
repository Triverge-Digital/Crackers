import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ORDER_ENQUIRY_MODULE } from "../../../modules/order-enquiry"
import OrderEnquiryModuleService from "../../../modules/order-enquiry/service"
import { ORDER_ENQUIRY_STATUSES } from "../../../modules/order-enquiry/models/order-enquiry"
import { referenceFromId } from "../../../lib/order-reference"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: OrderEnquiryModuleService = req.scope.resolve(ORDER_ENQUIRY_MODULE)

  const status = typeof req.query.status === "string" ? req.query.status : undefined
  const filters: Record<string, unknown> = {}
  if (status && (ORDER_ENQUIRY_STATUSES as readonly string[]).includes(status)) {
    filters.status = status
  }

  const take = Math.min(Number(req.query.limit) || 100, 500)
  const skip = Math.max(Number(req.query.offset) || 0, 0)

  const [enquiries, count] = await service.listAndCountOrderEnquiries(filters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  res.json({
    order_enquiries: enquiries.map((e) => ({ ...e, reference: referenceFromId(e.id) })),
    count,
    limit: take,
    offset: skip,
    statuses: ORDER_ENQUIRY_STATUSES,
  })
}
