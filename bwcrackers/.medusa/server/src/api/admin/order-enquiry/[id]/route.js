"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const order_enquiry_1 = require("../../../../modules/order-enquiry");
async function GET(req, res) {
    const orderEnquiryService = req.scope.resolve(order_enquiry_1.ORDER_ENQUIRY_MODULE);
    const id = req.params.id;
    const enquiry = await orderEnquiryService.retrieveOrderEnquiry(id);
    res.json({ order_enquiry: enquiry });
}
async function POST(req, res) {
    const orderEnquiryService = req.scope.resolve(order_enquiry_1.ORDER_ENQUIRY_MODULE);
    const id = req.params.id;
    const { status } = req.body;
    const enquiry = await orderEnquiryService.updateOrderEnquiries({
        id,
        status,
    });
    res.json({ order_enquiry: enquiry });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL29yZGVyLWVucXVpcnkvW2lkXS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLGtCQU9DO0FBRUQsb0JBV0M7QUF2QkQscUVBQXdFO0FBR2pFLEtBQUssVUFBVSxHQUFHLENBQUMsR0FBa0IsRUFBRSxHQUFtQjtJQUMvRCxNQUFNLG1CQUFtQixHQUE4QixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxvQ0FBb0IsQ0FBQyxDQUFBO0lBQzlGLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFBO0lBRXhCLE1BQU0sT0FBTyxHQUFHLE1BQU0sbUJBQW1CLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLENBQUE7SUFFbEUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO0FBQ3RDLENBQUM7QUFFTSxLQUFLLFVBQVUsSUFBSSxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDaEUsTUFBTSxtQkFBbUIsR0FBOEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsb0NBQW9CLENBQUMsQ0FBQTtJQUM5RixNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQTtJQUN4QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQTBCLENBQUE7SUFFakQsTUFBTSxPQUFPLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxvQkFBb0IsQ0FBQztRQUM3RCxFQUFFO1FBQ0YsTUFBTTtLQUNQLENBQUMsQ0FBQTtJQUVGLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtBQUN0QyxDQUFDIn0=