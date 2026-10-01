'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveCustomer } from '@/admin/actions/customers';
import { Card, btnSecondary, inputCls, labelCls } from '@/admin/ui';

type C = { id: string; name: string; email: string; address: string; city: string; state: string; pincode: string; admin_notes: string };

export default function CustomerForm({ customer }: { customer: C }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const field = (name: keyof C, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className={labelCls} htmlFor={name}>{label}</label>
      <input id={name} name={name} defaultValue={customer[name]} className={inputCls} {...props} />
    </div>
  );
  return (
    <Card title="Details">
      <form
        action={form => start(async () => {
          const r = await saveCustomer(customer.id, form);
          setMsg(r.ok ? { ok: true, text: 'Saved' } : { ok: false, text: r.error });
          if (r.ok) router.refresh();
        })}
        className="px-4 sm:px-5 py-4 space-y-3"
      >
        {field('name', 'Name', { required: true })}
        {field('email', 'Email', { type: 'email' })}
        {field('address', 'Address')}
        <div className="grid grid-cols-2 gap-3">
          {field('city', 'City')}
          {field('state', 'State')}
        </div>
        {field('pincode', 'Pincode', { inputMode: 'numeric', maxLength: 6 })}
        <div>
          <label className={labelCls} htmlFor="admin_notes">Private notes</label>
          <textarea id="admin_notes" name="admin_notes" rows={3} defaultValue={customer.admin_notes} className={inputCls} placeholder="e.g. Regular customer, prefers KPN parcel" />
        </div>
        <button type="submit" disabled={pending} className={`${btnSecondary} w-full`}>{pending ? 'Saving…' : 'Save details'}</button>
        {msg && <p className={`text-sm font-bold ${msg.ok ? 'text-green-700' : 'text-red-700'}`} role="status">{msg.text}</p>}
      </form>
    </Card>
  );
}
