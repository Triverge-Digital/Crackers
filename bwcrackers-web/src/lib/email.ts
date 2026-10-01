import 'server-only';
import type { ShopSettings } from './settings';
import { spacedPhone } from './settings';
import { buildInvoicePdf } from './invoice';

// Order emails via Resend (resend.com), with the invoice PDF attached.
// Missing RESEND_API_KEY = emails are skipped; orders still work.

type EmailOrder = {
  reference: string;
  createdAt: Date;
  customer: { name: string; phone: string; email?: string | null; address: string };
  items: { code: string; name: string; unit: string | null; mrp: number; quantity: number; price: number; line_total: number }[];
  subtotal: number;
  mrpTotal: number;
  packingFee: number;
  grandTotal: number;
  notes?: string | null;
};

const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const rs = (n: number) => `Rs.${Math.round(n).toLocaleString('en-IN')}`;

/**
 * Phone-first email: one 100%-wide column (max 600px), no fixed-width tables,
 * each item on its own row. Renders the same in Gmail, Outlook and Apple Mail.
 */
function orderHtml(o: EmailOrder, s: ShopSettings, forShop: boolean) {
  const when = o.createdAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  const font = "font-family:Arial,Helvetica,sans-serif;";
  const items = o.items
    .map(
      it => `
      <tr>
        <td style="${font}padding:12px 0;border-bottom:1px solid #eeeeee;vertical-align:top;">
          <div style="font-size:14px;font-weight:bold;color:#1A1A4E;line-height:1.35;">${esc(it.name)}</div>
          <div style="font-size:12px;color:#777777;margin-top:3px;">${it.quantity} &times; ${rs(it.price)}${it.unit ? ` &middot; ${esc(it.unit)}` : ''}</div>
        </td>
        <td style="${font}padding:12px 0 12px 12px;border-bottom:1px solid #eeeeee;vertical-align:top;text-align:right;white-space:nowrap;font-size:14px;font-weight:bold;color:#1A1A4E;">${rs(it.line_total)}</td>
      </tr>`,
    )
    .join('');
  const row = (label: string, value: string, strong = false) => `
      <tr>
        <td style="${font}padding:5px 0;font-size:${strong ? 16 : 13}px;color:${strong ? '#1A1A4E' : '#555555'};${strong ? 'font-weight:bold;' : ''}">${label}</td>
        <td style="${font}padding:5px 0;text-align:right;white-space:nowrap;font-size:${strong ? 18 : 13}px;color:${strong ? '#16a34a' : '#1A1A4E'};font-weight:bold;">${value}</td>
      </tr>`;
  const b = s.bank;
  const intro = forShop
    ? `New order from <b>${esc(o.customer.name)}</b> &mdash; ${o.items.length} products, ${rs(o.grandTotal)}. The invoice PDF is attached.`
    : `Thank you, <b>${esc(o.customer.name.split(' ')[0])}</b>! We've received your order and will call or WhatsApp you to confirm it. <b>Pay only after we confirm.</b> Your invoice is attached as a PDF.`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting">
<title>Order #${esc(o.reference)}</title></head>
<body style="margin:0;padding:0;background:#f2f2f6;-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f6;"><tr><td align="center" style="padding:16px 10px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;">

  <tr><td style="background:#1A1A4E;padding:22px 20px;text-align:center;${font}">
    <div style="color:#FFD700;font-size:20px;font-weight:bold;letter-spacing:2px;">B&amp;W CRACKERS</div>
    <div style="color:#c9c9e3;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">${forShop ? 'New order received' : 'Order received'}</div>
  </td></tr>

  <tr><td style="padding:20px 20px 6px;${font}">
    <div style="font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Order reference</div>
    <div style="font-size:24px;color:#1A1A4E;font-weight:bold;margin-top:2px;">#${esc(o.reference)}</div>
    <div style="font-size:12px;color:#777777;margin-top:2px;">${esc(when)}</div>
    <div style="font-size:14px;color:#333333;line-height:1.55;margin-top:14px;">${intro}</div>
  </td></tr>

  <tr><td style="padding:14px 20px 0;${font}">
    <div style="background:#f7f7fb;border-radius:10px;padding:14px;">
      <div style="font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:1px;font-weight:bold;margin-bottom:6px;">Delivery details</div>
      <div style="font-size:14px;color:#1A1A4E;font-weight:bold;">${esc(o.customer.name)}</div>
      <div style="font-size:13px;color:#444444;margin-top:3px;">+91 ${esc(o.customer.phone.replace(/^\+91/, ''))}${o.customer.email ? `<br>${esc(o.customer.email)}` : ''}</div>
      <div style="font-size:13px;color:#444444;margin-top:3px;line-height:1.45;">${esc(o.customer.address)}</div>
      ${o.notes ? `<div style="font-size:13px;color:#92400e;background:#fffbeb;border-radius:8px;padding:8px 10px;margin-top:10px;">Note: ${esc(o.notes)}</div>` : ''}
    </div>
  </td></tr>

  <tr><td style="padding:18px 20px 0;${font}">
    <div style="font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Items (${o.items.length})</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>
  </td></tr>

  <tr><td style="padding:10px 20px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${o.mrpTotal > o.subtotal ? row('You saved', `${rs(o.mrpTotal - o.subtotal)}`) : ''}
      ${row('Items total', rs(o.subtotal))}
      ${row(`Packing (${s.packingFeePct}%)`, rs(o.packingFee))}
      ${row('Transport', 'Paid at parcel office')}
      <tr><td colspan="2" style="border-top:2px solid #1A1A4E;padding-top:4px;"></td></tr>
      ${row('Total', rs(o.grandTotal), true)}
    </table>
  </td></tr>

  ${forShop ? '' : `
  <tr><td style="padding:18px 20px 0;${font}">
    <div style="background:#fff8e1;border:1px solid #ffe082;border-radius:10px;padding:14px;font-size:13px;color:#444444;line-height:1.6;">
      <div style="font-size:14px;font-weight:bold;color:#1A1A4E;margin-bottom:6px;">How to pay (after we confirm)</div>
      UPI / GPay / PhonePe: <b>${esc(b.upi)}</b><br>
      Account name: <b>${esc(b.name)}</b><br>
      Account no: <b>${esc(b.account)}</b><br>
      IFSC: <b>${esc(b.ifsc)}</b><br>
      ${esc(b.bank)}, ${esc(b.branch)}<br>
      <span style="color:#b45309;">Please quote <b>#${esc(o.reference)}</b> with your payment.</span>
    </div>
  </td></tr>
  <tr><td style="padding:12px 20px 0;${font}">
    <div style="font-size:12px;color:#92400e;line-height:1.5;">Please record an unboxing video when you open the parcel &mdash; claims for damaged or missing items need it.</div>
  </td></tr>`}

  <tr><td style="padding:20px;${font}">
    <div style="background:#1A1A4E;border-radius:10px;padding:14px;text-align:center;color:#c9c9e3;font-size:12px;line-height:1.6;">
      Questions? Call or WhatsApp <a href="tel:+91${esc(s.contact.primaryPhone)}" style="color:#ffffff;font-weight:bold;text-decoration:none;">+91 ${esc(spacedPhone(s.contact.primaryPhone))}</a><br>
      <a href="https://bwcrackers.com" style="color:#FFD700;text-decoration:none;">bwcrackers.com</a>
    </div>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}

async function send(to: string[], subject: string, html: string, attachments: { filename: string; content: string }[]) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to.length) return;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.ORDER_EMAIL_FROM || 'B&W Crackers <orders@bwcrackers.com>', to, subject, html, attachments }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text().catch(() => '')}`);
}

/** Notifies the shop and (if they gave an email) the customer, with the invoice PDF attached. Never throws. */
export async function sendOrderEmails(o: EmailOrder, s: ShopSettings, logoPng?: string) {
  if (!process.env.RESEND_API_KEY) return;
  let attachments: { filename: string; content: string }[] = [];
  try {
    const pdf = buildInvoicePdf({
      reference: o.reference,
      createdAt: o.createdAt.toISOString(),
      status: 'pending',
      shop: { name: 'B&W Crackers', address: s.contact.address, phone: spacedPhone(s.contact.primaryPhone), email: s.contact.email, website: 'bwcrackers.com' },
      bank: s.bank,
      customer: o.customer,
      items: o.items,
      subtotal: o.subtotal,
      mrpTotal: o.mrpTotal,
      packingFee: o.packingFee,
      packingPct: s.packingFeePct,
      grandTotal: o.grandTotal,
      amountPaid: 0,
      logoPng,
    });
    attachments = [{ filename: `BW-Crackers-Invoice-${o.reference}.pdf`, content: Buffer.from(pdf).toString('base64') }];
  } catch (e) {
    console.error('[order-email] invoice PDF failed, sending without it', e);
  }

  const jobs = [send(s.orderEmails, `New order #${o.reference} — ${o.customer.name} (${rs(o.grandTotal)})`, orderHtml(o, s, true), attachments)];
  if (o.customer.email) jobs.push(send([o.customer.email], `Order #${o.reference} received — B&W Crackers`, orderHtml(o, s, false), attachments));
  const results = await Promise.allSettled(jobs);
  for (const r of results) if (r.status === 'rejected') console.error('[order-email]', r.reason);
}
