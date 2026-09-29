import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ORDER_ENQUIRY_MODULE } from "../../../../modules/order-enquiry"
import OrderEnquiryModuleService from "../../../../modules/order-enquiry/service"
import {
  ORDER_ENQUIRY_STATUSES,
  OrderEnquiryStatus,
} from "../../../../modules/order-enquiry/models/order-enquiry"
import { referenceFromId } from "../../../../lib/order-reference"

type UpdateBody = {
  status?: unknown
  tracking_number?: unknown
  admin_notes?: unknown
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: OrderEnquiryModuleService = req.scope.resolve(ORDER_ENQUIRY_MODULE)
  const enquiry = await service.retrieveOrderEnquiry(req.params.id)
  res.json({ order_enquiry: { ...enquiry, reference: referenceFromId(enquiry.id) } })
}

export async function POST(req: MedusaRequest<UpdateBody>, res: MedusaResponse) {
  const service: OrderEnquiryModuleService = req.scope.resolve(ORDER_ENQUIRY_MODULE)
  const body = (req.body ?? {}) as UpdateBody
  const update: Record<string, unknown> = { id: req.params.id }

  if (body.status !== undefined) {
    if (
      typeof body.status !== "string" ||
      !(ORDER_ENQUIRY_STATUSES as readonly string[]).includes(body.status)
    ) {
      return res.status(400).json({
        message: `status must be one of: ${ORDER_ENQUIRY_STATUSES.join(", ")}`,
      })
    }
    update.status = body.status as OrderEnquiryStatus
  }

  if (body.tracking_number !== undefined) {
    if (body.tracking_number !== null && typeof body.tracking_number !== "string") {
      return res.status(400).json({ message: "tracking_number must be a string." })
    }
    const value = (body.tracking_number as string | null)?.trim() ?? ""
    update.tracking_number = value ? value.slice(0, 120) : null
  }

  if (body.admin_notes !== undefined) {
    if (body.admin_notes !== null && typeof body.admin_notes !== "string") {
      return res.status(400).json({ message: "admin_notes must be a string." })
    }
    const value = (body.admin_notes as string | null)?.trim() ?? ""
    update.admin_notes = value ? value.slice(0, 2000) : null
  }

  if (Object.keys(update).length === 1) {
    return res.status(400).json({ message: "Nothing to update." })
  }

  const enquiry = await service.updateOrderEnquiries(update as any)
  res.json({ order_enquiry: { ...enquiry, reference: referenceFromId(enquiry.id) } })
}
