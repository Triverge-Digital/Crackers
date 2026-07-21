import { Category } from '../data/pricelist';

export interface EstimatePdf {
  blob: Blob;
  /** base64 (no data: prefix) — for emailing as a Resend attachment */
  base64: string;
  filename: string;
}

/** Render the invoice HTML fully client-side into a single-page PDF (no server needed). */
async function renderPdfFromHtml(html: string, reference: string): Promise<EstimatePdf> {
  // Loaded on demand so the PDF libraries stay out of the main bundle
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.left = '-10000px';
  iframe.style.top = '0';
  iframe.style.width = '820px';
  iframe.style.height = '1200px';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(html);
    doc.close();

    // Wait for the document (and the logo image) to be ready
    await new Promise<void>((resolve) => {
      if (doc.readyState === 'complete') resolve();
      else iframe.onload = () => resolve();
    });
    const logo = doc.querySelector('img');
    if (logo && !logo.complete) {
      await new Promise<void>((resolve) => {
        logo.onload = () => resolve();
        logo.onerror = () => resolve();
      });
    }
    await new Promise((r) => setTimeout(r, 120));

    const target = (doc.querySelector('.page') as HTMLElement) || doc.body;
    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: target.scrollWidth,
      windowHeight: target.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const pdfWidth = 760;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [pdfWidth, pdfHeight] });
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    const blob = pdf.output('blob');
    const base64 = pdf.output('datauristring').split(',')[1] || '';
    return { blob, base64, filename: `BW-Crackers-Estimate-${reference}.pdf` };
  } finally {
    document.body.removeChild(iframe);
  }
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

function buildEstimateHTML(
  cart: Record<string, number>,
  pricelist: Category[],
  customer: CustomerInfo,
  reference: string,
  itemsTotal: number,
  packingFee: number,
  grandTotal: number,
  withPrintScript = true,
): string {
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
  // Always stamp the invoice in IST, regardless of the customer's device timezone.
  const istParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).formatToParts(now);
  const ist = (type: string) => istParts.find(p => p.type === type)?.value || '';
  const dateStr = `${ist('day')}-${ist('month')}-${ist('year')}`;
  const timeStr = `${ist('hour')}:${ist('minute')} ${ist('dayPeriod')}`;

  const logoUrl = window.location.origin + '/logo.png';
  const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const rowsHtml = items.map((item, idx) => `
    <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f4f5fb'};">
      <td style="padding:12px 14px;border-bottom:1px solid #e8e8f0;border-right:1px solid #e8e8f0;text-align:center;font-size:12px;color:#999;">${idx + 1}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #e8e8f0;border-right:1px solid #e8e8f0;font-size:12px;color:#1A1A4E;font-weight:700;">${item.name}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #e8e8f0;border-right:1px solid #e8e8f0;text-align:center;font-size:12px;color:#666;">${item.unit}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #e8e8f0;border-right:1px solid #e8e8f0;text-align:center;font-size:12px;color:#555;font-weight:600;">${item.qty}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #e8e8f0;border-right:1px solid #e8e8f0;text-align:right;font-size:12px;color:#555;">${fmt(item.price)}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #e8e8f0;text-align:right;font-size:13px;color:#1A1A4E;font-weight:900;background:#fffde8;">${fmt(item.lineTotal)}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${reference} - B&amp;W Crackers</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: #222; background: #0E0B38; }
    .page { max-width: 760px; margin: 0 auto; background: #fff; overflow: hidden; }
    @page { margin: 0; size: A4; }
    @media print {
      body { background: white; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page { max-width: 100%; margin: 0; border-radius: 0 !important; box-shadow: none !important; }
    }
    @media screen {
      body { padding: 20px 0 48px; }
      .page { border-radius: 10px; box-shadow: 0 16px 60px rgba(0,0,0,0.5); }
    }
  </style>
</head>
<body>

  <div class="no-print" style="max-width:760px;margin:0 auto 14px;text-align:right;padding:0 4px;">
    <button onclick="window.print()" style="background:#FFD700;color:#1A1A4E;border:none;padding:10px 28px;border-radius:8px;font-weight:900;font-size:13px;cursor:pointer;letter-spacing:0.5px;box-shadow:0 4px 14px rgba(255,215,0,0.35);">
      ⬇ Download / Print
    </button>
  </div>

  <div class="page">

    <!-- ── HEADER ── -->
    <div style="background:linear-gradient(135deg,#0E0B38 0%,#1A1A4E 55%,#2A1865 100%);padding:28px 32px;position:relative;overflow:hidden;">
      <!-- dot grid overlay -->
      <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.07) 1.5px,transparent 1.5px);background-size:22px 22px;pointer-events:none;"></div>
      <!-- glow orbs -->
      <div style="position:absolute;top:-60px;left:30%;width:220px;height:220px;border-radius:50%;background:rgba(255,215,0,0.07);pointer-events:none;"></div>
      <div style="position:absolute;bottom:-80px;right:-40px;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,0.03);pointer-events:none;"></div>

      <div style="position:relative;display:flex;align-items:center;justify-content:space-between;gap:20px;">
        <!-- Left: logo + company info -->
        <div style="display:flex;align-items:center;gap:18px;">
          <div style="flex-shrink:0;width:76px;height:76px;border-radius:50%;border:2.5px solid rgba(255,215,0,0.5);padding:3px;background:rgba(255,255,255,0.05);">
            <img src="${logoUrl}" alt="B&amp;W Crackers" style="width:100%;height:100%;border-radius:50%;display:block;object-fit:cover;" onerror="this.parentElement.style.display='none'"/>
          </div>
          <div>
            <div style="color:#FFD700;font-size:20px;font-weight:900;letter-spacing:2px;line-height:1;">B&amp;W CRACKERS</div>
            <div style="width:40px;height:2.5px;background:linear-gradient(90deg,#FFD700,transparent);margin:7px 0;border-radius:2px;"></div>
            <div style="color:rgba(255,255,255,0.55);font-size:10.5px;line-height:2;">
              Ph: +91 7867036289<br/>
              www.bwcrackers.com<br/>
              Sivakasi, Tamil Nadu
            </div>
          </div>
        </div>

        <!-- Right: INVOICE + reference badge -->
        <div style="text-align:right;flex-shrink:0;">
          <div style="color:#FFD700;font-size:40px;font-weight:900;letter-spacing:10px;line-height:1;text-shadow:0 4px 20px rgba(255,215,0,0.3);">INVOICE</div>
          <div style="margin-top:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,215,0,0.25);border-radius:8px;padding:10px 16px;display:inline-block;text-align:right;">
            <div style="color:rgba(255,255,255,0.45);font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Invoice No</div>
            <div style="color:#FFD700;font-size:15px;font-weight:900;letter-spacing:1px;">${reference}</div>
            <div style="color:rgba(255,255,255,0.5);font-size:10px;margin-top:4px;font-weight:600;">${dateStr} &nbsp;·&nbsp; ${timeStr}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- gold accent line -->
    <div style="height:4px;background:linear-gradient(90deg,#FFD700,#F59E0B,#FFD700);"></div>

    <!-- ── INVOICE TO ── -->
    <div style="padding:20px 32px 22px;background:#f4f5fb;border-bottom:1px solid #e0e0ee;">
      <div style="display:flex;align-items:flex-start;gap:24px;">
        <div style="flex:1;border-left:3px solid #1A1A4E;padding-left:14px;">
          <div style="font-size:8.5px;font-weight:800;color:#7986CB;text-transform:uppercase;letter-spacing:2.5px;margin-bottom:7px;">Invoice To</div>
          <div style="font-size:19px;font-weight:900;color:#1A1A4E;line-height:1;">${customer.name}</div>
          <div style="font-size:12px;color:#666;margin-top:8px;line-height:2.1;">
            <span style="color:#999;font-size:11px;">&#9990;</span>&nbsp; +91${customer.phone}<br/>
            <span style="color:#999;font-size:11px;">&#9679;</span>&nbsp; Delivery: ${customer.address}
          </div>
        </div>
      </div>
    </div>

    <!-- ── ITEMS TABLE ── -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-left:1px solid #e0e0ee;border-right:1px solid #e0e0ee;">
      <thead>
        <tr style="background:linear-gradient(90deg,#1A1A4E 0%,#2D1B6B 100%);">
          <th style="padding:12px 14px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.75);text-align:center;width:46px;border-right:1px solid rgba(255,255,255,0.08);">S.No</th>
          <th style="padding:12px 14px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.75);text-align:left;border-right:1px solid rgba(255,255,255,0.08);">Product Name</th>
          <th style="padding:12px 14px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.75);text-align:center;width:78px;border-right:1px solid rgba(255,255,255,0.08);">Type</th>
          <th style="padding:12px 14px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.75);text-align:center;width:72px;border-right:1px solid rgba(255,255,255,0.08);">Qty</th>
          <th style="padding:12px 14px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.75);text-align:right;width:90px;border-right:1px solid rgba(255,255,255,0.08);">Price</th>
          <th style="padding:12px 14px;font-size:11px;font-weight:800;color:#FFD700;text-align:right;width:100px;background:rgba(255,215,0,0.1);">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <!-- ── TOTALS ── -->
    <div style="background:#f4f5fb;border-top:1px solid #e0e0ee;border-left:1px solid #e0e0ee;border-right:1px solid #e0e0ee;display:flex;justify-content:flex-end;">
      <table cellpadding="0" cellspacing="0" style="width:340px;margin:16px 32px 16px 0;">
        <tr>
          <td style="font-size:12.5px;color:#777;padding:5px 0;">Sub Total</td>
          <td style="font-size:12.5px;color:#aaa;padding:5px 14px;text-align:center;">:</td>
          <td style="font-size:12.5px;color:#444;font-weight:700;text-align:right;padding:5px 0;">${fmt(subTotalMrp)}</td>
        </tr>
        <tr>
          <td colspan="3" style="padding:4px 0;"><div style="height:1px;background:#e0e0ee;"></div></td>
        </tr>
        <tr style="background:rgba(211,47,47,0.06);border-radius:4px;">
          <td style="font-size:13px;color:#C62828;font-weight:800;padding:7px 8px 7px 0;">Discount</td>
          <td style="font-size:13px;color:#C62828;padding:7px 14px;text-align:center;">:</td>
          <td style="font-size:15px;color:#C62828;font-weight:900;text-align:right;padding:7px 0;">${discountPct}%</td>
        </tr>
        <tr>
          <td colspan="3" style="padding:4px 0;"><div style="height:1px;background:#e0e0ee;"></div></td>
        </tr>
        <tr>
          <td style="font-size:12.5px;color:#777;padding:5px 0;">Total</td>
          <td style="font-size:12.5px;color:#aaa;padding:5px 14px;text-align:center;">:</td>
          <td style="font-size:12.5px;color:#444;font-weight:700;text-align:right;padding:5px 0;">${fmt(itemsTotal)}</td>
        </tr>
        <tr>
          <td style="font-size:12.5px;color:#777;padding:5px 0;">Packaging (2%)</td>
          <td style="font-size:12.5px;color:#aaa;padding:5px 14px;text-align:center;">:</td>
          <td style="font-size:12.5px;color:#444;font-weight:700;text-align:right;padding:5px 0;">${fmt(packingFee)}</td>
        </tr>
        <tr>
          <td style="font-size:12.5px;color:#777;padding:5px 0;">Transport</td>
          <td style="font-size:12.5px;color:#aaa;padding:5px 14px;text-align:center;">:</td>
          <td style="font-size:11.5px;color:#bbb;font-style:italic;text-align:right;padding:5px 0;">To be confirmed</td>
        </tr>
      </table>
    </div>

    <!-- ── NET TOTAL BANNER ── -->
    <div style="background:linear-gradient(135deg,#0E0B38 0%,#1A1A4E 50%,#2A1865 100%);padding:22px 32px;display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden;">
      <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.05) 1.5px,transparent 1.5px);background-size:20px 20px;pointer-events:none;"></div>
      <div style="position:relative;">
        <div style="color:rgba(255,255,255,0.4);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;">Amount Due</div>
        <div style="color:rgba(255,255,255,0.6);font-size:11px;margin-top:3px;">Incl. packaging &amp; all charges</div>
      </div>
      <div style="position:relative;display:flex;align-items:center;gap:14px;">
        <div style="color:rgba(255,255,255,0.55);font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Net Total</div>
        <div style="width:1px;height:32px;background:rgba(255,215,0,0.3);"></div>
        <div style="color:#FFD700;font-size:30px;font-weight:900;letter-spacing:1px;text-shadow:0 0 24px rgba(255,215,0,0.4);">Rs.${fmt(grandTotal)}</div>
      </div>
    </div>

    <!-- ── THANK YOU ── -->
    <div style="padding:14px 32px;background:#fffde8;border-top:3px solid #FFD700;text-align:center;">
      <span style="font-size:13px;color:#7B5800;font-weight:700;font-style:italic;letter-spacing:0.5px;">&#9733; &nbsp;Thankyou for your order!&nbsp; &#9733;</span>
    </div>

    <!-- ── PAYMENT DETAILS ── -->
    <div style="padding:22px 32px 26px;background:#fff;border-top:1px solid #e0e0ee;">
      <!-- section title -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
        <div style="width:18px;height:3px;background:linear-gradient(90deg,#FFD700,#F59E0B);border-radius:2px;flex-shrink:0;"></div>
        <div style="font-size:10px;font-weight:900;color:#1A1A4E;text-transform:uppercase;letter-spacing:2.5px;">Payment Details</div>
        <div style="flex:1;height:1px;background:#e8e8f0;"></div>
      </div>

      <div style="display:flex;gap:16px;">

        <!-- Bank Transfer card -->
        <div style="flex:1;border:1px solid #e0e0ee;border-radius:10px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1A1A4E,#2D1B6B);padding:10px 16px;display:flex;align-items:center;gap:8px;">
            <div style="width:28px;height:28px;border-radius:50%;background:rgba(255,215,0,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="font-size:14px;color:#FFD700;">&#9883;</span>
            </div>
            <div style="font-size:9.5px;font-weight:800;color:rgba(255,255,255,0.75);text-transform:uppercase;letter-spacing:1.5px;">Bank Transfer</div>
          </div>
          <div style="padding:14px 16px;background:#f8f8fb;">
            <div style="font-size:13px;font-weight:900;color:#1A1A4E;margin-bottom:10px;">WAHIDH HUSSAIN S</div>
            <table cellpadding="0" cellspacing="0" style="width:100%;">
              <tr>
                <td style="font-size:10.5px;color:#999;font-weight:600;padding:3px 0;width:44px;">Bank</td>
                <td style="font-size:10.5px;color:#999;padding:3px 8px;">:</td>
                <td style="font-size:10.5px;color:#444;font-weight:600;padding:3px 0;">TamilNadu Mercantile Bank</td>
              </tr>
              <tr>
                <td style="font-size:10.5px;color:#999;font-weight:600;padding:3px 0;">A/C</td>
                <td style="font-size:10.5px;color:#999;padding:3px 8px;">:</td>
                <td style="font-size:10.5px;color:#444;font-weight:600;padding:3px 0;">003100050344099</td>
              </tr>
              <tr>
                <td style="font-size:10.5px;color:#999;font-weight:600;padding:3px 0;">IFSC</td>
                <td style="font-size:10.5px;color:#999;padding:3px 8px;">:</td>
                <td style="font-size:10.5px;color:#444;font-weight:600;padding:3px 0;">TMBL0000003 &middot; Sivakasi</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- UPI card -->
        <div style="flex:1;border:1px solid #e0e0ee;border-radius:10px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#7B5800,#B8860B);padding:10px 16px;display:flex;align-items:center;gap:8px;">
            <div style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="font-size:14px;color:#fff;">&#9993;</span>
            </div>
            <div style="font-size:9.5px;font-weight:800;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1.5px;">UPI / Instant Pay</div>
          </div>
          <div style="padding:16px;background:#fffde8;display:flex;flex-direction:column;justify-content:center;height:calc(100% - 49px);">
            <div style="font-size:24px;font-weight:900;color:#1A1A4E;letter-spacing:1px;line-height:1;">7867036289</div>
            <div style="font-size:10px;color:#999;font-weight:600;margin-top:6px;letter-spacing:0.5px;">PhonePe &nbsp;&middot;&nbsp; GPay</div>
            <div style="margin-top:12px;display:flex;gap:8px;">
              <span style="background:#6739B7;color:white;font-size:9px;font-weight:800;padding:3px 8px;border-radius:4px;letter-spacing:0.5px;">PhonePe</span>
              <span style="background:#1A73E8;color:white;font-size:9px;font-weight:800;padding:3px 8px;border-radius:4px;letter-spacing:0.5px;">GPay</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ── FOOTER ── -->
    <div style="background:linear-gradient(90deg,#0E0B38,#1A1A4E);padding:12px 32px;display:flex;align-items:center;justify-content:space-between;">
      <div style="color:rgba(255,255,255,0.3);font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">B&amp;W Crackers &nbsp;&middot;&nbsp; Sivakasi &nbsp;&middot;&nbsp; Tamil Nadu</div>
      <div style="color:#FFD700;font-size:9.5px;font-weight:800;letter-spacing:1px;">www.bwcrackers.com</div>
    </div>

  </div>

  ${withPrintScript ? `<script>
    const img = document.querySelector('img');
    if (img && !img.complete) {
      img.onload = () => setTimeout(() => window.print(), 300);
      img.onerror = () => setTimeout(() => window.print(), 300);
    } else {
      setTimeout(() => window.print(), 600);
    }
  </script>` : ''}
</body>
</html>`;
}

export async function generateEstimatePDF(
  cart: Record<string, number>,
  pricelist: Category[],
  customer: CustomerInfo,
  reference: string,
  itemsTotal: number,
  packingFee: number,
  grandTotal: number,
): Promise<EstimatePdf | null> {
  try {
    const html = buildEstimateHTML(cart, pricelist, customer, reference, itemsTotal, packingFee, grandTotal, false);
    return await renderPdfFromHtml(html, reference);
  } catch {
    // Fallback: open a print window so the customer can still save/print the estimate
    const html = buildEstimateHTML(cart, pricelist, customer, reference, itemsTotal, packingFee, grandTotal, true);
    const win = window.open('', '_blank', 'width=820,height=960,scrollbars=yes');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
    }
    return null;
  }
}

/** Trigger a browser download of a generated estimate PDF. */
export function downloadEstimatePdf(pdf: EstimatePdf): void {
  const url = URL.createObjectURL(pdf.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = pdf.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
