import { NextResponse } from 'next/server';
import { adminClient } from '@/admin/auth';
import { buildInvoicePdf } from '@/lib/invoice';
import { normalizeSettings, spacedPhone } from '@/lib/settings';
import { logoDataUrl } from '@/lib/logo';

export const runtime = 'nodejs';

/** Invoice PDF for one order. Opens in the browser (print / share / save). Admins only. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let db;
  try {
    ({ db } = await adminClient());
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 401 });
  }
  const { id } = await params;
  const [{ data: order }, { data: items }, { data: settingsRow }] = await Promise.all([
    db.from('orders').select('*').eq('id', id).maybeSingle(),
    db.from('order_items').select('code, name, unit, mrp, price, quantity, line_total').eq('order_id', id).order('id'),
    db.from('settings').select('data').eq('id', 1).maybeSingle(),
  ]);
  if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  const s = normalizeSettings(settingsRow?.data);

  const pdf = buildInvoicePdf({
    reference: order.reference,
    createdAt: order.created_at,
    status: order.status,
    shop: { name: 'B&W Crackers', address: s.contact.address, phone: spacedPhone(s.contact.primaryPhone), email: s.contact.email, website: 'bwcrackers.com' },
    bank: s.bank,
    customer: { name: order.customer_name, phone: order.phone, email: order.email, address: [order.address, order.city, order.state, order.pincode].filter(Boolean).join(', ') },
    items: (items ?? []).map(i => ({ ...i, mrp: Number(i.mrp), price: Number(i.price), line_total: Number(i.line_total) })),
    subtotal: Number(order.subtotal),
    mrpTotal: Number(order.mrp_total),
    packingFee: Number(order.packing_fee),
    packingPct: s.packingFeePct,
    grandTotal: Number(order.grand_total),
    amountPaid: Number(order.amount_paid),
    transporter: order.transporter,
    trackingNumber: order.tracking_number,
    logoPng: await logoDataUrl(req.url),
  });

  const download = new URL(req.url).searchParams.has('download');
  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="BW-Crackers-Invoice-${order.reference}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
