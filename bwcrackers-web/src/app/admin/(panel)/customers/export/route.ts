import { NextResponse } from 'next/server';
import { adminClient } from '@/admin/auth';

/** CSV of all customers with order totals (opens in Excel / Google Sheets). Admins only. */
export async function GET() {
  let db;
  try {
    ({ db } = await adminClient());
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 401 });
  }

  const [{ data: customers }, { data: orders }] = await Promise.all([
    db.from('customers').select('id, name, phone, email, address, city, state, pincode, created_at').order('created_at'),
    db.from('orders').select('customer_id, grand_total, status, created_at'),
  ]);
  const stats = new Map<string, { n: number; spent: number; last: string }>();
  for (const o of orders ?? []) {
    if (!o.customer_id) continue;
    const s = stats.get(o.customer_id) ?? { n: 0, spent: 0, last: '' };
    s.n++;
    if (o.status !== 'cancelled') s.spent += Number(o.grand_total);
    if (o.created_at > s.last) s.last = o.created_at;
    stats.set(o.customer_id, s);
  }

  const cell = (v: unknown) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const day = (iso: string) => (iso ? new Date(iso).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : '');
  const rows = [
    ['Name', 'Phone', 'Email', 'Address', 'City', 'State', 'Pincode', 'Orders', 'Total spent (Rs)', 'Last order', 'Customer since'],
    ...(customers ?? []).map(c => {
      const s = stats.get(c.id);
      return [c.name, c.phone, c.email, c.address, c.city, c.state, c.pincode, s?.n ?? 0, Math.round(s?.spent ?? 0), day(s?.last ?? ''), day(c.created_at)];
    }),
  ];
  const csv = '﻿' + rows.map(r => r.map(cell).join(',')).join('\r\n');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="bw-crackers-customers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
