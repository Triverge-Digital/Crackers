import { MedusaService } from "@medusajs/framework/utils"
import OrderEnquiry from "./models/order-enquiry"

class OrderEnquiryModuleService extends MedusaService({
  OrderEnquiry,
}) {}

export default OrderEnquiryModuleService
