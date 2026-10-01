import { NextResponse } from 'next/server';
import { z } from 'zod';
import { serviceClient } from '@/lib/supabase/service';
import { normalizeSettings } from '@/lib/settings';
import { newReference, normalizeIndianPhone } from '@/lib/orders';
import { sendOrderEmails } from '@/lib/email';
import { logoDataUrl } from '@/lib/logo';

export const runtime = 'nodejs';

const OrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, 'Please enter your name').max(120),
    phone: z.string().trim(),
    email: z.string().trim().max(160).optional().refine(v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email or leave it blank'),
    address: z.string().trim().min(8, 'Enter your full delivery address').max(400),
    city: z.string().trim().max(80).optional(),
    state: z.string().trim().max(80).optional(),
    pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
    notes: z.string().trim().max(600).optional(),
  }),
  items: z
    .array(z.object({ code: z.string().trim().min(1).max(16), quantity: z.number().int().min(1).max(999) }))
    .min(1, 'Add at least one item')
    .max(200),
});

// Best-effort abuse guard (per server instance): 10 orders per 10 minutes per IP.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(t => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 10;
}

const fail = (message: string, status = 400, extra: Record<string, unknown> = {}) => NextResponse.json({ message, ...extra }, { status });

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (rateLimited(ip)) return fail('Too many orders from this connection. Please wait a few minutes or WhatsApp us.', 429);

  const parsed = OrderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Please check your details');
  const { customer, items } = parsed.data;

  const phone = normalizeIndianPhone(customer.phone);
  if (!phone) return fail('Enter a valid 10-digit Indian mobile number');

  let db;
  try {
    db = serviceClient();
  } catch {
    return fail('Online ordering is not available right now', 503);
  }

  const { data: settingsRow } = await db.from('settings').select('data').eq('id', 1).maybeSingle();
  const settings = normalizeSettings(settingsRow?.data);
  if (!settings.orderingEnabled) return fail('Online ordering is paused right now. Please call or WhatsApp us to order.', 409);

  // Merge duplicate lines, then price everything from the database — never from the browser.
  const qtyByCode = new Map<string, number>();
  for (const it of items) qtyByCode.set(it.code, Math.min(999, (qtyByCode.get(it.code) ?? 0) + it.quantity));
  const { data: products, error: pErr } = await db
    .from('products')
    .select('id, code, name, unit, mrp, price, is_active, in_stock')
    .in('code', [...qtyByCode.keys()]);
  if (pErr) return fail('Could not check prices, please try again', 500);

  const byCode = new Map(products.map(p => [p.code, p]));
  const unavailable = [...qtyByCode.keys()].filter(code => {
    const p = byCode.get(code);
    return !p || !p.is_active || !p.in_stock || Number(p.price) <= 0;
  });
  if (unavailable.length) {
    const names = unavailable.map(c => byCode.get(c)?.name ?? `item ${c}`).join(', ');
    return fail(`Sorry, these are no longer available: ${names}. Remove them from your order and try again.`, 409, { unavailable });
  }

  const lines = [...qtyByCode].map(([code, quantity]) => {
    const p = byCode.get(code)!;
    const price = Number(p.price);
    return { product_id: p.id, code, name: p.name, unit: p.unit, mrp: Number(p.mrp), price, quantity, line_total: price * quantity };
  });
  const subtotal = lines.reduce((s, l) => s + l.line_total, 0);
  const mrpTotal = lines.reduce((s, l) => s + l.mrp * l.quantity, 0);
  const packingFee = Math.ceil((subtotal * settings.packingFeePct) / 100);
  const grandTotal = subtotal + packingFee;
  if (subtotal < settings.minOrder) {
    return fail(`Minimum order is Rs.${settings.minOrder.toLocaleString('en-IN')}. Add Rs.${(settings.minOrder - subtotal).toLocaleString('en-IN')} more.`);
  }

  // Customer record keyed by phone; details refresh with each order.
  const { data: cust, error: cErr } = await db
    .from('customers')
    .upsert(
      { phone, name: customer.name, email: customer.email || null, address: customer.address, city: customer.city || null, state: customer.state || null, pincode: customer.pincode },
      { onConflict: 'phone' },
    )
    .select('id')
    .single();
  if (cErr) return fail('Could not save your order, please try again', 500);

  const fullAddress = [customer.address, customer.city, customer.state, customer.pincode].filter(Boolean).join(', ');
  let order: { id: string; reference: string; created_at: string } | null = null;
  for (let attempt = 0; attempt < 4 && !order; attempt++) {
    const { data, error } = await db
      .from('orders')
      .insert({
        reference: newReference(),
        customer_id: cust.id,
        customer_name: customer.name,
        phone,
        email: customer.email || null,
        address: customer.address,
        city: customer.city || null,
        state: customer.state || null,
        pincode: customer.pincode,
        customer_notes: customer.notes || null,
        subtotal,
        mrp_total: mrpTotal,
        packing_fee: packingFee,
        grand_total: grandTotal,
      })
      .select('id, reference, created_at')
      .single();
    if (!error) order = data;
    else if (error.code !== '23505') return fail('Could not save your order, please try again', 500); // 23505 = reference clash, retry
  }
  if (!order) return fail('Could not save your order, please try again', 500);

  const { error: iErr } = await db.from('order_items').insert(lines.map(l => ({ ...l, order_id: order!.id })));
  if (iErr) {
    await db.from('orders').delete().eq('id', order.id);
    return fail('Could not save your order, please try again', 500);
  }
  await db.from('order_events').insert({ order_id: order.id, status: 'pending', note: 'Order placed on the website' });

  await sendOrderEmails(
    {
      reference: order.reference,
      createdAt: new Date(order.created_at),
      customer: { name: customer.name, phone, email: customer.email, address: fullAddress },
      items: lines,
      subtotal,
      mrpTotal,
      packingFee,
      grandTotal,
      notes: customer.notes,
    },
    settings,
    await logoDataUrl(req.url),
  );

  return NextResponse.json({ reference: `#${order.reference}`, subtotal, packing_fee: packingFee, grand_total: grandTotal }, { status: 201 });
}
