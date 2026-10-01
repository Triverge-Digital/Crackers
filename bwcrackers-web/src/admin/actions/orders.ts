'use server';

import { revalidatePath } from 'next/cache';
import { adminClient } from '../auth';
import { ORDER_STATUSES, OrderStatus, STATUS_LABEL } from '@/lib/orders';

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

export async function setOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<ActionResult> {
  try {
    if (!ORDER_STATUSES.includes(status)) return { ok: false, error: 'Unknown status' };
    const { db, user } = await adminClient();
    const { error } = await db.from('orders').update({ status }).eq('id', orderId);
    if (error) return { ok: false, error: error.message };
    await db.from('order_events').insert({ order_id: orderId, status, note: note?.trim() || null, created_by: user.id });
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin/orders');
    revalidatePath('/admin');
    return { ok: true, message: `Marked as ${STATUS_LABEL[status]}` };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function saveOrderDetails(orderId: string, form: FormData): Promise<ActionResult> {
  try {
    const { db, user } = await adminClient();
    const amount = Number(form.get('amount_paid') ?? 0);
    const patch = {
      amount_paid: Number.isFinite(amount) && amount >= 0 ? amount : 0,
      transporter: String(form.get('transporter') ?? '').trim() || null,
      tracking_number: String(form.get('tracking_number') ?? '').trim() || null,
      admin_notes: String(form.get('admin_notes') ?? '').trim() || null,
    };
    const { error } = await db.from('orders').update(patch).eq('id', orderId);
    if (error) return { ok: false, error: error.message };
    await db.from('order_events').insert({ order_id: orderId, note: 'Order details updated', created_by: user.id });
    revalidatePath(`/admin/orders/${orderId}`);
    return { ok: true, message: 'Saved' };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function addOrderNote(orderId: string, note: string): Promise<ActionResult> {
  try {
    if (!note.trim()) return { ok: false, error: 'Write a note first' };
    const { db, user } = await adminClient();
    const { error } = await db.from('order_events').insert({ order_id: orderId, note: note.trim(), created_by: user.id });
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/admin/orders/${orderId}`);
    return { ok: true, message: 'Note added' };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
