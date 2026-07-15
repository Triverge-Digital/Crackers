import { Category } from '../data/pricelist';

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export function generateEstimatePDF(
  cart: Record<string, number>,
  pricelist: Category[],
  customer: CustomerInfo,
  reference: string,
  itemsTotal: number,
  packingFee: number,
  grandTotal: number,
) {
  const items: Array<{ name: string; unit: string; qty: number; price: number; lineTotal: number; lineMrp: number }> = [];
  let subTotalMrp = 0;

  pricelist.forEach(cat => {
    cat.products.forEach(p => {
      const qty = cart[p.code];
      if (qty) {
        const lineTotal = p.discountPrice * qty;
        const lineMrp = p.mrp * qty;
        items.push({ name: p.name, unit: p.unit, qty, price: p.discountPrice, lineTotal, lineMrp });
        subTotalMrp += lineMrp;
      }
    });
  });

  const discountAmount = subTotalMrp - itemsTotal;
  const discountPct = subTotalMrp > 0 ? Math.round((discountAmount / subTotalMrp) * 100) : 80;

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStr = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} `
    + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const logoUrl = window.location.origin + '/logo.png';

  const rowsHtml = items.map((item, idx) => `
    <tr>
      <td style="padding:9px 10px;border-bottom:1px solid #eee;text-align:center;font-size:12px;color:#444;">${idx + 1}</td>
      <td style="padding:9px 10px;border-bottom:1px solid #eee;font-size:12px;color:#222;font-weight:600;">${item.name}</td>
      <td style="padding:9px 10px;border-bottom:1px solid #eee;text-align:center;font-size:12px;color:#444;">${item.unit}</td>
      <td style="padding:9px 10px;border-bottom:1px solid #eee;text-align:center;font-size:12px;color:#444;">${item.qty}</td>
      <td style="padding:9px 10px;border-bottom:1px solid #eee;text-align:right;font-size:12px;color:#444;">${item.price.toLocaleString('en-IN')}.00</td>
      <td style="padding:9px 10px;border-bottom:1px solid #eee;text-align:right;font-size:12px;color:#1A1A4E;font-weight:700;">${item.lineTotal.toLocaleString('en-IN')}.00</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Estimate ${reference} - B&amp;W Crackers</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; background: white; color: #222; }
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body style="max-width:760px;margin:0 auto;padding:24px;">

  <!-- Print button (hidden on print) -->
  <div class="no-print" style="text-align:right;margin-bottom:12px;">
    <button onclick="window.print()" style="background:#1A1A4E;color:white;border:none;padding:10px 24px;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;">
      Download / Print PDF
    </button>
  </div>

  <!-- HEADER -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1A1A4E,#2D1B6B);border-radius:8px 8px 0 0;padding:20px 24px;">
    <tr>
      <td style="vertical-align:middle;">
        <img src="${logoUrl}" alt="B&amp;W Crackers" height="64" style="display:block;max-height:64px;width:auto;" onerror="this.style.display='none'"/>
      </td>
      <td style="text-align:right;vertical-align:middle;">
        <div style="color:#FFD700;font-size:26px;font-weight:900;letter-spacing:4px;">ESTIMATE</div>
        <div style="color:white;font-size:15px;font-weight:800;margin-top:3px;">B&amp;W CRACKERS</div>
        <div style="color:rgba(255,255,255,0.65);font-size:11px;margin-top:2px;">Ph: 7867036289</div>
        <div style="color:rgba(255,255,255,0.65);font-size:11px;">bwcrackers.com</div>
      </td>
    </tr>
  </table>

  <!-- CUSTOMER + REF -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ddd;border-top:none;background:#fafafa;padding:16px 24px;">
    <tr>
      <td style="vertical-align:top;">
        <div style="font-size:10px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Estimate To</div>
        <div style="font-size:15px;font-weight:800;color:#1A1A4E;">${customer.name}</div>
        ${customer.email ? `<div style="font-size:12px;color:#555;margin-top:2px;">Email : ${customer.email}</div>` : ''}
        <div style="font-size:12px;color:#555;margin-top:2px;">Phone : +91${customer.phone}</div>
        <div style="font-size:12px;color:#555;margin-top:2px;">Delivery point : ${customer.address}</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div style="font-size:12px;color:#555;">Estimate No : <strong style="color:#1A1A4E;">${reference}</strong></div>
        <div style="font-size:12px;color:#555;margin-top:6px;">Date : <strong style="color:#1A1A4E;">${dateStr}</strong></div>
      </td>
    </tr>
  </table>

  <!-- ITEMS TABLE -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #ddd;border-top:none;">
    <thead>
      <tr style="background:#1A1A4E;color:white;">
        <th style="padding:10px 10px;font-size:12px;font-weight:700;text-align:center;width:48px;">S.No</th>
        <th style="padding:10px 10px;font-size:12px;font-weight:700;text-align:left;">Product Name</th>
        <th style="padding:10px 10px;font-size:12px;font-weight:700;text-align:center;width:80px;">Type</th>
        <th style="padding:10px 10px;font-size:12px;font-weight:700;text-align:center;width:60px;">Quantity</th>
        <th style="padding:10px 10px;font-size:12px;font-weight:700;text-align:right;width:80px;">Price</th>
        <th style="padding:10px 10px;font-size:12px;font-weight:700;text-align:right;width:90px;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <!-- TOTALS -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ddd;border-top:none;padding:14px 24px 14px 0;">
    <tr>
      <td>&nbsp;</td>
      <td width="280" style="padding-right:8px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#555;">Sub Total</td>
            <td style="padding:5px 0;font-size:13px;color:#555;text-align:center;width:20px;">:</td>
            <td style="padding:5px 0;font-size:13px;font-weight:600;text-align:right;">${subTotalMrp.toLocaleString('en-IN')}.00</td>
          </tr>
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#c53030;font-weight:700;">Discount</td>
            <td style="padding:5px 0;font-size:13px;color:#c53030;text-align:center;">:</td>
            <td style="padding:5px 0;font-size:13px;font-weight:800;color:#c53030;text-align:right;">${discountPct}%</td>
          </tr>
          <tr>
            <td colspan="3" style="padding:3px 0;"><hr style="border:none;border-top:1px solid #c53030;"/></td>
          </tr>
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#555;">Total</td>
            <td style="padding:5px 0;font-size:13px;color:#555;text-align:center;">:</td>
            <td style="padding:5px 0;font-size:13px;font-weight:600;text-align:right;">${itemsTotal.toLocaleString('en-IN')}.00</td>
          </tr>
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#555;">Packaging (2%)</td>
            <td style="padding:5px 0;font-size:13px;color:#555;text-align:center;">:</td>
            <td style="padding:5px 0;font-size:13px;font-weight:600;text-align:right;">${packingFee.toLocaleString('en-IN')}.00</td>
          </tr>
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#555;">Transport</td>
            <td style="padding:5px 0;font-size:13px;color:#555;text-align:center;">:</td>
            <td style="padding:5px 0;font-size:12px;font-weight:600;text-align:right;color:#888;">To be confirmed</td>
          </tr>
          <tr>
            <td colspan="3" style="padding:3px 0;"><hr style="border:none;border-top:1px solid #ddd;"/></td>
          </tr>
          <tr>
            <td style="padding:7px 0;font-size:14px;font-weight:800;color:#1A1A4E;">Net Total</td>
            <td style="padding:7px 0;font-size:14px;color:#1A1A4E;text-align:center;">:</td>
            <td style="padding:7px 0;font-size:16px;font-weight:900;color:#1A1A4E;text-align:right;">Rs.${grandTotal.toLocaleString('en-IN')}.00</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- THANK YOU -->
  <div style="border:1px solid #ddd;border-top:none;padding:12px 24px;text-align:center;background:#fffdf5;">
    <p style="font-size:13px;color:#666;font-style:italic;font-weight:600;">Thankyou for your order!</p>
  </div>

  <!-- BANK INFO -->
  <div style="border:1px solid #ddd;border-top:none;padding:16px 24px;background:#fafafa;border-radius:0 0 8px 8px;">
    <div style="font-size:14px;font-weight:900;color:#1A1A4E;margin-bottom:8px;text-decoration:underline;">BANK INFO</div>
    <div style="font-size:12px;color:#c53030;line-height:1.9;">
      NAME : WAHIDH HUSSAIN S<br/>
      TamilNadu Mercantile Bank<br/>
      AC NO : 003100050344099<br/>
      IFSC : TMBL0000003<br/>
      Sivakasi Branch<br/>
      <strong>PHONEPE : 7867036289</strong><br/>
      <strong>GPAY : 7867036289</strong>
    </div>
  </div>

  <script>
    // Wait for logo image to load before auto-printing
    const img = document.querySelector('img');
    if (img && !img.complete) {
      img.onload = () => setTimeout(() => window.print(), 300);
      img.onerror = () => setTimeout(() => window.print(), 300);
    } else {
      setTimeout(() => window.print(), 600);
    }
  </script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=820,height=960,scrollbars=yes');
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
  }
}
