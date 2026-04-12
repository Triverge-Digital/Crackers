"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const order_enquiry_1 = __importDefault(require("./models/order-enquiry"));
class OrderEnquiryModuleService extends (0, utils_1.MedusaService)({
    OrderEnquiry: order_enquiry_1.default,
}) {
}
exports.default = OrderEnquiryModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL29yZGVyLWVucXVpcnkvc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFEQUF5RDtBQUN6RCwyRUFBaUQ7QUFFakQsTUFBTSx5QkFBMEIsU0FBUSxJQUFBLHFCQUFhLEVBQUM7SUFDcEQsWUFBWSxFQUFaLHVCQUFZO0NBQ2IsQ0FBQztDQUFHO0FBRUwsa0JBQWUseUJBQXlCLENBQUEifQ==