import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/supabase/service';
import { normalizeIndianPhone, normalizeReference } from '@/lib/orders';

export const runtime = 'nodejs';

const NOT_FOUND = 'No order found with that reference and mobile number.';

/** Order status for customers: needs both the reference and the phone number used on the order. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const ref = normalizeReference(url.searchParams.get('ref') ?? '');
  const phone = normalizeIndianPhone(url.searchParams.get('phone') ?? '');
  if (!ref || !phone) return NextResponse.json({ message: 'Enter your order reference and 10-digit mobile number.' }, { status: 400 });

  let db;
  try {
    db = serviceClient();
  } catch {
    return NextResponse.json({ message: 'Order tracking is not available right now.' }, { status: 503 });
  }

  const { data: order } = await db
    .from('orders')
    .select('id, reference, status, customer_name, phone, created_at, updated_at, subtotal, packing_fee, grand_total, tracking_number, transporter')
    .eq('reference', ref)
    .maybeSingle();
  if (!order || order.phone !== phone) return NextResponse.json({ message: NOT_FOUND }, { status: 404 });

  const { data: items } = await db.from('order_items').select('name, quantity, price').eq('order_id', order.id).order('id');

  return NextResponse.json({
    order: {
      reference: `#${order.reference}`,
      status: order.status,
      customer_name: order.customer_name,
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: (items ?? []).map(i => ({ title: i.name, quantity: i.quantity, unit_price: Number(i.price) })),
      subtotal: Number(order.subtotal),
      packing_fee: Number(order.packing_fee),
      grand_total: Number(order.grand_total),
      tracking_number: order.tracking_number,
      transporter: order.transporter,
    },
  });
}
