const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bwcrackers.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'B&W Crackers <orders@bwcrackers.com>';

function buildEmailHtml({ customer, items, itemsTotal, packingFee, grandTotal, reference }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    + ' at ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const rowsHtml = items.map((item, idx) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#555;text-align:center;">${idx + 1}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#222;font-weight:600;">${item.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#555;text-align:center;">${item.unit}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#555;text-align:center;">${item.qty}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#555;text-align:right;">Rs.${Number(item.price).toLocaleString('en-IN')}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;font-weight:700;color:#1A1A4E;text-align:right;">Rs.${Number(item.total).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - B&amp;W Crackers</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:600px;margin:24px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,#1A1A4E,#2D1B6B);padding:28px 32px;text-align:center;">
    <div style="color:#FFD700;font-size:22px;font-weight:900;letter-spacing:3px;margin-bottom:4px;">B&amp;W CRACKERS</div>
    <div style="color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Order Confirmation</div>
  </div>

  <!-- SUCCESS BADGE -->
  <div style="background:#f0fdf4;border-bottom:1px solid #dcfce7;padding:20px 32px;text-align:center;">
    <div style="display:inline-block;background:#22c55e;color:white;font-size:28px;width:52px;height:52px;line-height:52px;border-radius:50%;margin-bottom:10px;">✓</div>
    <div style="font-size:18px;font-weight:800;color:#15803d;">Order Placed Successfully!</div>
    <div style="font-size:13px;color:#16a34a;margin-top:4px;">We'll confirm your order and contact you shortly.</div>
  </div>

  <!-- ORDER INFO -->
  <div style="padding:24px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="vertical-align:top;">
          <div style="font-size:11px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Order Reference</div>
          <div style="font-size:16px;font-weight:900;color:#1A1A4E;">${reference}</div>
        </td>
        <td style="text-align:right;vertical-align:top;">
          <div style="font-size:11px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Date</div>
          <div style="font-size:13px;font-weight:600;color:#444;">${dateStr}</div>
        </td>
      </tr>
    </table>
  </div>

  <!-- CUSTOMER DETAILS -->
  <div style="margin:20px 32px;background:#f8f9ff;border:1px solid #e8eaf6;border-radius:10px;padding:16px;">
    <div style="font-size:11px;color:#7986cb;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Customer Details</div>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-size:12px;color:#555;padding-bottom:6px;width:100px;">Name</td>
        <td style="font-size:13px;font-weight:700;color:#1A1A4E;padding-bottom:6px;">${customer.name}</td>
      </tr>
      <tr>
        <td style="font-size:12px;color:#555;padding-bottom:6px;">Phone</td>
        <td style="font-size:13px;font-weight:700;color:#1A1A4E;padding-bottom:6px;">+91 ${customer.phone}</td>
      </tr>
      ${customer.email ? `
      <tr>
        <td style="font-size:12px;color:#555;padding-bottom:6px;">Email</td>
        <td style="font-size:13px;font-weight:700;color:#1A1A4E;padding-bottom:6px;">${customer.email}</td>
      </tr>` : ''}
      <tr>
        <td style="font-size:12px;color:#555;vertical-align:top;">Address</td>
        <td style="font-size:13px;font-weight:700;color:#1A1A4E;">${customer.address}</td>
      </tr>
    </table>
  </div>

  <!-- ITEMS TABLE -->
  <div style="margin:0 32px;">
    <div style="font-size:11px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Items Ordered</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden;border-collapse:separate;border-spacing:0;">
      <thead>
        <tr style="background:#1A1A4E;">
          <th style="padding:10px 12px;font-size:11px;font-weight:700;color:white;text-align:center;width:36px;">#</th>
          <th style="padding:10px 12px;font-size:11px;font-weight:700;color:white;text-align:left;">Product</th>
          <th style="padding:10px 12px;font-size:11px;font-weight:700;color:white;text-align:center;width:60px;">Unit</th>
          <th style="padding:10px 12px;font-size:11px;font-weight:700;color:white;text-align:center;width:44px;">Qty</th>
          <th style="padding:10px 12px;font-size:11px;font-weight:700;color:white;text-align:right;width:70px;">Price</th>
          <th style="padding:10px 12px;font-size:11px;font-weight:700;color:white;text-align:right;width:80px;">Total</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  </div>

  <!-- TOTALS -->
  <div style="margin:16px 32px;background:#f8f9ff;border:1px solid #e8eaf6;border-radius:10px;padding:16px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-size:13px;color:#555;padding-bottom:8px;">Items Total</td>
        <td style="font-size:13px;font-weight:600;color:#1A1A4E;text-align:right;padding-bottom:8px;">Rs.${Number(itemsTotal).toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#555;padding-bottom:8px;">Packing Fee (2%)</td>
        <td style="font-size:13px;font-weight:600;color:#1A1A4E;text-align:right;padding-bottom:8px;">Rs.${Number(packingFee).toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#555;padding-bottom:4px;">Transport Charges</td>
        <td style="font-size:12px;font-weight:600;color:#888;text-align:right;padding-bottom:4px;">To be confirmed</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:8px 0;"><hr style="border:none;border-top:1px solid #ddd;"/></td>
      </tr>
      <tr>
        <td style="font-size:15px;font-weight:800;color:#1A1A4E;">Net Total</td>
        <td style="font-size:17px;font-weight:900;color:#16a34a;text-align:right;">Rs.${Number(grandTotal).toLocaleString('en-IN')}</td>
      </tr>
    </table>
  </div>

  <!-- PAYMENT INFO -->
  <div style="margin:0 32px 20px;">
    <div style="font-size:11px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Payment Details</div>
    <div style="background:#fff8e1;border:1px solid #ffe082;border-radius:10px;padding:16px;">
      <div style="font-size:13px;font-weight:800;color:#1A1A4E;margin-bottom:10px;">Pay after order confirmation</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:12px;color:#555;padding-bottom:5px;width:130px;">GPay / PhonePe UPI</td>
          <td style="font-size:13px;font-weight:700;color:#1A1A4E;padding-bottom:5px;">7867036289</td>
        </tr>
        <tr>
          <td style="font-size:12px;color:#555;padding-bottom:5px;">Account Name</td>
          <td style="font-size:13px;font-weight:700;color:#1A1A4E;padding-bottom:5px;">WAHIDH HUSSAIN S</td>
        </tr>
        <tr>
          <td style="font-size:12px;color:#555;padding-bottom:5px;">Account Number</td>
          <td style="font-size:13px;font-weight:700;color:#1A1A4E;padding-bottom:5px;">003100050344099</td>
        </tr>
        <tr>
          <td style="font-size:12px;color:#555;padding-bottom:5px;">IFSC Code</td>
          <td style="font-size:13px;font-weight:700;color:#1A1A4E;padding-bottom:5px;">TMBL0000003</td>
        </tr>
        <tr>
          <td style="font-size:12px;color:#555;">Bank</td>
          <td style="font-size:13px;font-weight:700;color:#1A1A4E;">TamilNadu Mercantile Bank, Sivakasi</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- UNBOXING POLICY -->
  <div style="margin:0 32px 24px;background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:14px;">
    <div style="font-size:11px;font-weight:800;color:#b45309;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Important — Unboxing Policy</div>
    <div style="font-size:12px;color:#92400e;line-height:1.6;">Claims for damaged or missing items will be accepted <strong>only if an unboxing video is provided</strong> at the time of opening the package.</div>
  </div>

  <!-- FOOTER -->
  <div style="background:#1A1A4E;padding:20px 32px;text-align:center;">
    <div style="color:#FFD700;font-size:14px;font-weight:800;margin-bottom:4px;">B&amp;W Crackers</div>
    <div style="color:rgba(255,255,255,0.5);font-size:11px;">Ph: 7867036289 &nbsp;|&nbsp; bwcrackers.com</div>
    <div style="color:rgba(255,255,255,0.35);font-size:10px;margin-top:8px;">Flat 80% Discount — Direct from Sivakasi</div>
  </div>

</div>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!RESEND_API_KEY) {
    // Silently succeed if email is not configured yet
    return res.status(200).json({ success: true, note: 'Email not configured' });
  }

  const { customer, items, itemsTotal, packingFee, grandTotal, reference } = req.body;

  const html = buildEmailHtml({ customer, items, itemsTotal, packingFee, grandTotal, reference });

  const sendEmail = async (to, subject) => {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
    });
    return r.ok;
  };

  try {
    const adminSubject = `New Order ${reference} — ${customer.name} (Rs.${Number(grandTotal).toLocaleString('en-IN')})`;
    await sendEmail(ADMIN_EMAIL, adminSubject);

    if (customer.email) {
      const customerSubject = `Your Order is Confirmed! ${reference} — B&W Crackers`;
      await sendEmail(customer.email, customerSubject);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
