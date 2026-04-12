"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const order_enquiry_1 = require("../../../modules/order-enquiry");
async function GET(req, res) {
    const orderEnquiryService = req.scope.resolve(order_enquiry_1.ORDER_ENQUIRY_MODULE);
    const enquiries = await orderEnquiryService.listOrderEnquiries({}, { order: { created_at: "DESC" } });
    res.json({ order_enquiries: enquiries });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL29yZGVyLWVucXVpcnkvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxrQkFTQztBQVpELGtFQUFxRTtBQUc5RCxLQUFLLFVBQVUsR0FBRyxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDL0QsTUFBTSxtQkFBbUIsR0FBOEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsb0NBQW9CLENBQUMsQ0FBQTtJQUU5RixNQUFNLFNBQVMsR0FBRyxNQUFNLG1CQUFtQixDQUFDLGtCQUFrQixDQUM1RCxFQUFFLEVBQ0YsRUFBRSxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FDbEMsQ0FBQTtJQUVELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQTtBQUMxQyxDQUFDIn0=