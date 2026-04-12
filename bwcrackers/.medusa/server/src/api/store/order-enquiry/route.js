"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
exports.GET = GET;
const order_enquiry_1 = require("../../../modules/order-enquiry");
async function POST(req, res) {
    const orderEnquiryService = req.scope.resolve(order_enquiry_1.ORDER_ENQUIRY_MODULE);
    const { customer_name, phone, email, address, city, state, pincode, notes, items, subtotal, currency_code, } = req.body;
    if (!customer_name || !phone || !items || !items.length) {
        return res.status(400).json({
            message: "customer_name, phone, and items are required.",
        });
    }
    const phoneClean = phone.replace(/\s+/g, "");
    if (!/^\+91\d{10}$/.test(phoneClean)) {
        return res.status(400).json({
            message: "Phone must be a valid Indian number (+91XXXXXXXXXX).",
        });
    }
    const enquiry = await orderEnquiryService.createOrderEnquiries({
        customer_name,
        phone: phoneClean,
        email: email || null,
        address: address || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
        notes: notes || null,
        items: items,
        subtotal,
        currency_code: currency_code || "inr",
        status: "pending",
    });
    res.status(201).json({ order_enquiry: enquiry });
}
async function GET(req, res) {
    const orderEnquiryService = req.scope.resolve(order_enquiry_1.ORDER_ENQUIRY_MODULE);
    const enquiries = await orderEnquiryService.listOrderEnquiries({}, { order: { created_at: "DESC" } });
    res.json({ order_enquiries: enquiries });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL29yZGVyLWVucXVpcnkvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxvQkEwREM7QUFFRCxrQkFTQztBQXhFRCxrRUFBcUU7QUFHOUQsS0FBSyxVQUFVLElBQUksQ0FBQyxHQUFrQixFQUFFLEdBQW1CO0lBQ2hFLE1BQU0sbUJBQW1CLEdBQThCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLG9DQUFvQixDQUFDLENBQUE7SUFFOUYsTUFBTSxFQUNKLGFBQWEsRUFDYixLQUFLLEVBQ0wsS0FBSyxFQUNMLE9BQU8sRUFDUCxJQUFJLEVBQ0osS0FBSyxFQUNMLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFFBQVEsRUFDUixhQUFhLEdBQ2QsR0FBRyxHQUFHLENBQUMsSUFZUCxDQUFBO0lBRUQsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN4RCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRSwrQ0FBK0M7U0FDekQsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQzVDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7UUFDckMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixPQUFPLEVBQUUsc0RBQXNEO1NBQ2hFLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxNQUFNLE9BQU8sR0FBRyxNQUFNLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDO1FBQzdELGFBQWE7UUFDYixLQUFLLEVBQUUsVUFBVTtRQUNqQixLQUFLLEVBQUUsS0FBSyxJQUFJLElBQUk7UUFDcEIsT0FBTyxFQUFFLE9BQU8sSUFBSSxJQUFJO1FBQ3hCLElBQUksRUFBRSxJQUFJLElBQUksSUFBSTtRQUNsQixLQUFLLEVBQUUsS0FBSyxJQUFJLElBQUk7UUFDcEIsT0FBTyxFQUFFLE9BQU8sSUFBSSxJQUFJO1FBQ3hCLEtBQUssRUFBRSxLQUFLLElBQUksSUFBSTtRQUNwQixLQUFLLEVBQUUsS0FBWTtRQUNuQixRQUFRO1FBQ1IsYUFBYSxFQUFFLGFBQWEsSUFBSSxLQUFLO1FBQ3JDLE1BQU0sRUFBRSxTQUFTO0tBQ2xCLENBQUMsQ0FBQTtJQUVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7QUFDbEQsQ0FBQztBQUVNLEtBQUssVUFBVSxHQUFHLENBQUMsR0FBa0IsRUFBRSxHQUFtQjtJQUMvRCxNQUFNLG1CQUFtQixHQUE4QixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxvQ0FBb0IsQ0FBQyxDQUFBO0lBRTlGLE1BQU0sU0FBUyxHQUFHLE1BQU0sbUJBQW1CLENBQUMsa0JBQWtCLENBQzVELEVBQUUsRUFDRixFQUFFLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUNsQyxDQUFBO0lBRUQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO0FBQzFDLENBQUMifQ==