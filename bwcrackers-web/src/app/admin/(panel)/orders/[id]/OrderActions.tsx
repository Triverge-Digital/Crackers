'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, btnPrimary, btnSecondary, inputCls, labelCls } from '@/admin/ui';
import { setOrderStatus, saveOrderDetails, addOrderNote } from '@/admin/actions/orders';
import { ORDER_STATUSES, OrderStatus, STATUS_LABEL } from '@/lib/orders';

type Order = {
  id: string;
  reference: string;
  status: string;
  phone: string;
  customer_name: string;
  grand_total: number;
  amount_paid: number;
  transporter: string | null;
  tracking_number: string | null;
  admin_notes: string | null;
};
type Payment = { upi: string; account: string; ifsc: string; name: string; bank: string };

// The usual next step for each status, shown as the big button.
const NEXT: Partial<Record<OrderStatus, OrderStatus>> = { pending: 'confirmed', confirmed: 'paid', paid: 'packed', packed: 'dispatched', dispatched: 'delivered' };

function whatsappMessage(o: Order, p: Payment, kind: 'confirm' | 'paid' | 'dispatched') {
  const total = `Rs.${Math.round(o.grand_total).toLocaleString('en-IN')}`;
  const first = o.customer_name.split(' ')[0];
  if (kind === 'confirm')
    return `Hi ${first}, your B&W Crackers order #${o.reference} is confirmed. Total ${total}.\n\nPlease pay by UPI to ${p.upi} or bank transfer (${p.name}, A/c ${p.account}, IFSC ${p.ifsc}, ${p.bank}) and send the payment screenshot here, quoting #${o.reference}. Thank you!`;
  if (kind === 'paid') return `Hi ${first}, we have received your payment for order #${o.reference}. We'll pack and dispatch it soon. Thank you!`;
  return `Hi ${first}, your order #${o.reference} has been dispatched${o.transporter ? ` via ${o.transporter}` : ''}${o.tracking_number ? `. LR / tracking no: ${o.tracking_number}` : ''}. Please record an unboxing video when you open the parcel. Happy Diwali!`;
}

export default function OrderActions({ order, payment }: { order: Order; payment: Payment }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [note, setNote] = useState('');
  const status = order.status as OrderStatus;
  const next = NEXT[status];

  const run = (fn: () => Promise<{ ok: boolean; message?: string; error?: string }>) =>
    start(async () => {
      const r = await fn();
      setMsg({ ok: r.ok, text: r.ok ? r.message ?? 'Done' : r.error ?? 'Something went wrong' });
      if (r.ok) router.refresh();
    });

  const wa = (kind: 'confirm' | 'paid' | 'dispatched') =>
    `https://wa.me/${order.phone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage(order, payment, kind))}`;

  return (
    <div className="space-y-4 print:hidden">
      <Card title="Update status">
        <div className="px-4 sm:px-5 py-3 space-y-3">
          {next && (
            <button type="button" disabled={pending} onClick={() => run(() => setOrderStatus(order.id, next))} className={`${btnPrimary} w-full hidden lg:inline-flex`}>
              Mark as {STATUS_LABEL[next]}
            </button>
          )}
          <div className="grid grid-cols-3 gap-2">
            {ORDER_STATUSES.filter(s => s !== status && s !== next).map(s => (
              <button
                key={s}
                type="button"
                disabled={pending}
                onClick={() => {
                  if (s === 'cancelled' && !window.confirm('Cancel this order?')) return;
                  run(() => setOrderStatus(order.id, s));
                }}
                className={`rounded-xl border min-h-[40px] text-xs font-bold ${s === 'cancelled' ? 'border-red-200 text-red-700 hover:bg-red-50' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
          {msg && <p className={`text-sm font-bold ${msg.ok ? 'text-green-700' : 'text-red-700'}`} role="status">{msg.text}</p>}
        </div>
      </Card>

      <Card title="Message the customer">
        <div className="px-4 sm:px-5 py-3 grid gap-2">
          <a href={wa('confirm')} target="_blank" rel="noopener noreferrer" className={`${btnSecondary} justify-start`}>WhatsApp: order confirmed + payment details</a>
          <a href={wa('paid')} target="_blank" rel="noopener noreferrer" className={`${btnSecondary} justify-start`}>WhatsApp: payment received</a>
          <a href={wa('dispatched')} target="_blank" rel="noopener noreferrer" className={`${btnSecondary} justify-start`}>WhatsApp: dispatched + tracking</a>
        </div>
      </Card>

      <Card title="Payment & dispatch">
        <form action={form => run(() => saveOrderDetails(order.id, form))} className="px-4 sm:px-5 py-3 space-y-3">
          <div>
            <label className={labelCls} htmlFor="amount_paid">Amount received (₹)</label>
            <input id="amount_paid" name="amount_paid" type="number" min={0} step="1" inputMode="numeric" defaultValue={order.amount_paid || ''} placeholder={String(Math.round(order.grand_total))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="transporter">Transporter / parcel service</label>
            <input id="transporter" name="transporter" defaultValue={order.transporter ?? ''} placeholder="e.g. KPN Parcel" className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="tracking_number">LR / tracking number</label>
            <input id="tracking_number" name="tracking_number" defaultValue={order.tracking_number ?? ''} className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="admin_notes">Private notes (only admins see these)</label>
            <textarea id="admin_notes" name="admin_notes" rows={3} defaultValue={order.admin_notes ?? ''} className={inputCls} />
          </div>
          <button type="submit" disabled={pending} className={`${btnSecondary} w-full`}>Save details</button>
        </form>
      </Card>

      <Card title="Add a note to the history">
        <div className="px-4 sm:px-5 py-3 flex gap-2">
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Customer asked to deliver after 5 Nov" className={inputCls} />
          <button type="button" disabled={pending || !note.trim()} onClick={() => run(async () => { const r = await addOrderNote(order.id, note); if (r.ok) setNote(''); return r; })} className={btnSecondary}>Add</button>
        </div>
      </Card>
    </div>
  );
}
