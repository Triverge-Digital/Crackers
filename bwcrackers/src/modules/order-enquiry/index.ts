import OrderEnquiryModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const ORDER_ENQUIRY_MODULE = "orderEnquiry"

export default Module(ORDER_ENQUIRY_MODULE, {
  service: OrderEnquiryModuleService,
})
