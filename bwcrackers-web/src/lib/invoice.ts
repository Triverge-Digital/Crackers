import { jsPDF } from 'jspdf';
import { applyPlugin, type UserOptions } from 'jspdf-autotable';

// Registers doc.autoTable(); works the same under Node ESM and the Next.js bundler.
applyPlugin(jsPDF);

// A4 invoice for one order, built with jsPDF on the server. Standard PDF fonts
// have no ₹ glyph, so amounts print as "Rs.".

export type InvoiceData = {
  reference: string;
  createdAt: string;
  status: string;
  shop: { name: string; address: string; phone: string; email: string; website: string };
  bank: { name: string; account: string; bank: string; branch: string; ifsc: string; upi: string };
  customer: { name: string; phone: string; email?: string | null; address: string };
  items: { code: string; name: string; unit: string | null; mrp: number; price: number; quantity: number; line_total: number }[];
  subtotal: number;
  mrpTotal: number;
  packingFee: number;
  packingPct: number;
  grandTotal: number;
  amountPaid: number;
  transporter?: string | null;
  trackingNumber?: string | null;
  logoPng?: string; // data URL
};

const NAVY: [number, number, number] = [26, 26, 78];
const MAGENTA: [number, number, number] = [230, 0, 126];
const GREY: [number, number, number] = [110, 110, 120];
const rs = (n: number) => `Rs. ${Math.round(n).toLocaleString('en-IN')}`;

export function buildInvoicePdf(d: InvoiceData): ArrayBuffer {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const M = 14;

  // Header band
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 34, 'F');
  if (d.logoPng) {
    try { doc.addImage(d.logoPng, 'PNG', M, 6, 22, 22); } catch { /* logo optional */ }
  }
  const tx = d.logoPng ? M + 27 : M;
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold').setFontSize(18).text(d.shop.name, tx, 15);
  doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(220, 220, 235);
  doc.text(d.shop.address, tx, 21);
  doc.text(`Ph: +91 ${d.shop.phone}  |  ${d.shop.email}  |  ${d.shop.website}`, tx, 26);
  doc.setFont('helvetica', 'bold').setFontSize(16).setTextColor(255, 255, 255).text('INVOICE', W - M, 15, { align: 'right' });
  doc.setFont('helvetica', 'normal').setFontSize(9).text(`#${d.reference}`, W - M, 21, { align: 'right' });
  const date = new Date(d.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });
  doc.text(date, W - M, 26, { align: 'right' });

  // Bill to / order info
  let y = 44;
  doc.setTextColor(...GREY).setFontSize(8).setFont('helvetica', 'bold').text('BILL TO', M, y);
  doc.text('ORDER', W / 2 + 10, y);
  y += 5;
  doc.setTextColor(20, 20, 30).setFontSize(11).text(d.customer.name, M, y);
  doc.setFontSize(9).setFont('helvetica', 'normal');
  const addr = doc.splitTextToSize(d.customer.address, W / 2 - M - 4) as string[];
  doc.text([`+91 ${d.customer.phone.replace(/^\+91/, '')}${d.customer.email ? `  ·  ${d.customer.email}` : ''}`, ...addr], M, y + 5);

  const info: [string, string][] = [
    ['Order no.', `#${d.reference}`],
    ['Order date', date],
    ['Status', d.status.charAt(0).toUpperCase() + d.status.slice(1)],
  ];
  if (d.transporter) info.push(['Transporter', d.transporter]);
  if (d.trackingNumber) info.push(['LR / tracking', d.trackingNumber]);
  info.forEach(([k, v], i) => {
    doc.setTextColor(...GREY).text(k, W / 2 + 10, y + i * 5);
    doc.setTextColor(20, 20, 30).setFont('helvetica', 'bold').text(v, W - M, y + i * 5, { align: 'right' });
    doc.setFont('helvetica', 'normal');
  });
  y = Math.max(y + 5 + (addr.length + 1) * 4.5, y + info.length * 5) + 6;

  // Items
  (doc as unknown as { autoTable: (o: UserOptions) => void }).autoTable({
    startY: y,
    margin: { left: M, right: M },
    head: [['#', 'Code', 'Item', 'Unit', 'MRP', 'Rate', 'Qty', 'Amount']],
    body: d.items.map((it, i) => [String(i + 1), it.code, it.name, it.unit ?? '', rs(it.mrp), rs(it.price), String(it.quantity), rs(it.line_total)]),
    styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 2.2, textColor: [30, 30, 40], lineColor: [230, 230, 238], lineWidth: 0.1 },
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [247, 247, 252] },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 13 },
      3: { cellWidth: 15 },
      4: { cellWidth: 20, halign: 'right', textColor: GREY },
      5: { cellWidth: 20, halign: 'right' },
      6: { cellWidth: 11, halign: 'center' },
      7: { cellWidth: 24, halign: 'right', fontStyle: 'bold' },
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 6;
  if (y > 230) { doc.addPage(); y = 20; }

  // Totals
  const due = Math.max(0, d.grandTotal - d.amountPaid);
  const rows: [string, string, boolean?][] = [
    ['MRP total', rs(d.mrpTotal)],
    ['You saved', `- ${rs(d.mrpTotal - d.subtotal)}`],
    ['Items total', rs(d.subtotal)],
    [`Packing (${d.packingPct}%)`, rs(d.packingFee)],
    ['Transport', 'Paid at parcel office'],
    ['Total', rs(d.grandTotal), true],
  ];
  if (d.amountPaid > 0) rows.push(['Paid', rs(d.amountPaid)], ['Balance due', rs(due), true]);
  const bx = W - M - 78;
  rows.forEach(([k, v, strong], i) => {
    const ry = y + i * 6.2;
    if (strong) {
      doc.setFillColor(...(k === 'Total' ? NAVY : MAGENTA));
      doc.roundedRect(bx - 3, ry - 4.4, 81, 6.6, 1.2, 1.2, 'F');
      doc.setTextColor(255, 255, 255).setFont('helvetica', 'bold').setFontSize(10);
    } else {
      doc.setTextColor(...GREY).setFont('helvetica', 'normal').setFontSize(9);
    }
    doc.text(k, bx, ry);
    doc.text(v, W - M - 1, ry, { align: 'right' });
  });

  // Payment details
  doc.setDrawColor(230, 230, 238).setFillColor(250, 248, 255);
  doc.roundedRect(M, y - 4.5, 92, 40, 2, 2, 'FD');
  doc.setTextColor(...NAVY).setFont('helvetica', 'bold').setFontSize(9).text('Payment details', M + 4, y + 1);
  doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(40, 40, 50);
  doc.text([
    `UPI / GPay / PhonePe: ${d.bank.upi}`,
    `A/c name: ${d.bank.name}`,
    `A/c no: ${d.bank.account}`,
    `IFSC: ${d.bank.ifsc}`,
    `${d.bank.bank}, ${d.bank.branch}`,
    `Please quote #${d.reference} with your payment.`,
  ], M + 4, y + 7, { lineHeightFactor: 1.45 });

  // Footer
  const fy = doc.internal.pageSize.getHeight() - 22;
  doc.setDrawColor(...MAGENTA).setLineWidth(0.6).line(M, fy, W - M, fy);
  doc.setFontSize(8).setTextColor(...GREY).setFont('helvetica', 'normal');
  doc.text(
    doc.splitTextToSize('Goods travel by road via registered parcel services; transport is paid by the customer at the parcel office. Claims for damaged or missing items need an unboxing video recorded when the parcel is opened, shared on WhatsApp within 24 hours.', W - 2 * M) as string[],
    M, fy + 5,
  );
  doc.setTextColor(...NAVY).setFont('helvetica', 'bold').text(`Thank you for shopping with ${d.shop.name}!`, W / 2, fy + 16, { align: 'center' });

  return doc.output('arraybuffer');
}
