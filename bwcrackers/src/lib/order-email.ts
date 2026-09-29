import { Resend } from "resend"

type OrderEnquiryItem = {
  code?: string
  title: string
  quantity: number
  unit_price: number
}

export type OrderEnquiryEmailData = {
  id?: string
  reference?: string
  customer_name: string
  phone: string
  email?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  notes?: string | null
  items: OrderEnquiryItem[]
  subtotal: number
  packing_fee?: number
  grand_total?: number
  currency_code?: string
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

const FROM = process.env.ORDER_EMAIL_FROM || "orders@bwcrackers.com"
const TO = (process.env.ORDER_EMAIL_TO || "gmhussainnsui@gmail.com,bwcrackers@gmail.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

function inr(n: number) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`
}

function buildHtml(data: OrderEnquiryEmailData) {
  const rows = (data.items || [])
    .map(
      (it) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${it.code ? `<span style="color:#999;">${escapeHtml(it.code)}</span> ` : ""}${escapeHtml(it.title)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${it.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${inr(it.unit_price)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${inr(it.unit_price * it.quantity)}</td>
        </tr>`
    )
    .join("")

  const addressParts = [data.address, data.city, data.state, data.pincode]
    .filter(Boolean)
    .map(escapeHtml)
    .join(", ")

  const packingFee = data.packing_fee ?? 0
  const grandTotal = data.grand_total ?? data.subtotal + packingFee
  const waNumber = data.phone.replace(/[^\d]/g, "")

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#1a1a4e;">
    <h2 style="color:#c2185b;margin-bottom:4px;">New Order ${data.reference ? `#${escapeHtml(data.reference)}` : "Enquiry"}</h2>
    <p style="color:#555;margin-top:0;">A customer has placed an order on B&amp;W Crackers. Payment is collected manually after confirmation.</p>

    <h3 style="margin-bottom:6px;">Customer</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:4px 0;width:140px;color:#777;">Name</td><td>${escapeHtml(data.customer_name)}</td></tr>
      <tr><td style="padding:4px 0;color:#777;">Phone</td><td><a href="https://wa.me/${waNumber}" style="color:#1a1a4e;">${escapeHtml(data.phone)}</a></td></tr>
      ${data.email ? `<tr><td style="padding:4px 0;color:#777;">Email</td><td>${escapeHtml(data.email)}</td></tr>` : ""}
      ${addressParts ? `<tr><td style="padding:4px 0;color:#777;">Address</td><td>${addressParts}</td></tr>` : ""}
      ${data.notes ? `<tr><td style="padding:4px 0;color:#777;">Notes</td><td>${escapeHtml(data.notes)}</td></tr>` : ""}
    </table>

    <h3 style="margin-bottom:6px;margin-top:24px;">Order Items</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="background:#fafafa;">
          <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #eee;">Product</th>
          <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #eee;">Qty</th>
          <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #eee;">Price</th>
          <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #eee;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <table style="margin-left:auto;margin-top:16px;font-size:14px;border-collapse:collapse;">
      <tr><td style="padding:2px 12px;color:#777;">Items total</td><td style="text-align:right;">${inr(data.subtotal)}</td></tr>
      <tr><td style="padding:2px 12px;color:#777;">Packing &amp; handling (2%)</td><td style="text-align:right;">${inr(packingFee)}</td></tr>
      <tr><td style="padding:6px 12px;font-size:16px;font-weight:bold;">Grand total</td><td style="text-align:right;font-size:16px;font-weight:bold;">${inr(grandTotal)}</td></tr>
    </table>

    ${data.id ? `<p style="color:#999;font-size:12px;">Enquiry ID: ${escapeHtml(data.id)}</p>` : ""}
  </div>`
}

/**
 * Sends the order-enquiry notification email to the configured recipients.
 * Returns silently (logging a warning) if RESEND_API_KEY is not set, so that
 * order placement is never blocked by email delivery.
 */
export async function sendOrderEnquiryEmail(data: OrderEnquiryEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("[order-email] RESEND_API_KEY not set — skipping order notification email.")
    return
  }

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: `B&W Crackers <${FROM}>`,
    to: TO,
    replyTo: data.email || undefined,
    subject: `New Order ${data.reference ? `#${data.reference} ` : ""}— ${data.customer_name} (${inr(
      data.grand_total ?? data.subtotal
    )})`,
    html: buildHtml(data),
  })

  if (error) {
    throw new Error(`Resend error: ${error.message || JSON.stringify(error)}`)
  }
}
