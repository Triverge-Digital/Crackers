'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveSettings } from '@/admin/actions/settings';
import type { ShopSettings } from '@/lib/settings';
import { Card, btnPrimary, inputCls, labelCls } from '@/admin/ui';

function Field({ name, label, value, hint, ...props }: { name: string; label: string; value: string | number; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className={labelCls} htmlFor={name}>{label}</label>
      <input id={name} name={name} defaultValue={value} className={inputCls} {...props} />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function SettingsForm({ settings: s }: { settings: ShopSettings }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <form
      action={form => start(async () => {
        const r = await saveSettings(form);
        setMsg(r.ok ? { ok: true, text: 'Settings saved — live on the website' } : { ok: false, text: r.error });
        if (r.ok) router.refresh();
      })}
      className="space-y-4 max-w-3xl"
    >
      <Card title="Ordering">
        <div className="px-4 sm:px-5 py-4 grid gap-4 sm:grid-cols-3">
          <label className="sm:col-span-3 flex items-start gap-3 rounded-xl border border-gray-200 p-3 cursor-pointer">
            <input type="checkbox" name="orderingEnabled" defaultChecked={s.orderingEnabled} className="mt-0.5 h-5 w-5 accent-brand-magenta" />
            <span><span className="font-bold text-sm">Accept orders on the website</span><span className="block text-xs text-gray-500">Switch off to pause ordering (e.g. after the Diwali cut-off). Customers can still browse prices.</span></span>
          </label>
          <Field name="minOrder" label="Minimum order (₹)" value={s.minOrder} type="number" min={0} inputMode="numeric" />
          <Field name="packingFeePct" label="Packing fee (%)" value={s.packingFeePct} type="number" min={0} max={20} step="0.5" />
          <Field name="discountPct" label="Discount shown (%)" value={s.discountPct} type="number" min={0} max={95} hint="Used in website text and the price helper" />
          <div className="sm:col-span-3">
            <Field name="dispatchDeadline" label="Diwali dispatch closes at (India time)" value={s.dispatchDeadline ?? ''} type="datetime-local" hint="Shows a countdown on the homepage. Leave empty to hide it." />
          </div>
        </div>
      </Card>

      <Card title="Offer strip at the top of the website">
        <div className="px-4 sm:px-5 py-4">
          <label className={labelCls} htmlFor="announcement">One message per line</label>
          <textarea id="announcement" name="announcement" rows={4} defaultValue={s.announcement.join('\n')} className={inputCls} />
        </div>
      </Card>

      <Card title="Contact details">
        <div className="px-4 sm:px-5 py-4 grid gap-4 sm:grid-cols-2">
          <Field name="contact.primaryPhone" label="Main phone" value={s.contact.primaryPhone} inputMode="tel" required />
          <Field name="contact.secondaryPhone" label="Second phone" value={s.contact.secondaryPhone} inputMode="tel" />
          <Field name="contact.whatsapp" label="WhatsApp number" value={s.contact.whatsapp} inputMode="tel" hint="Used by all “Chat on WhatsApp” buttons" />
          <Field name="contact.email" label="Email" value={s.contact.email} type="email" />
          <Field name="contact.instagram" label="Instagram link" value={s.contact.instagram} type="url" />
          <Field name="contact.address" label="Address" value={s.contact.address} />
        </div>
      </Card>

      <Card title="Payment details (shown to customers)">
        <div className="px-4 sm:px-5 py-4 grid gap-4 sm:grid-cols-2">
          <Field name="bank.upi" label="UPI / GPay number" value={s.bank.upi} />
          <Field name="bank.name" label="Account name" value={s.bank.name} />
          <Field name="bank.account" label="Account number" value={s.bank.account} inputMode="numeric" />
          <Field name="bank.ifsc" label="IFSC" value={s.bank.ifsc} />
          <Field name="bank.bank" label="Bank" value={s.bank.bank} />
          <Field name="bank.branch" label="Branch" value={s.bank.branch} />
          <Field name="bank.type" label="Account type" value={s.bank.type} />
        </div>
      </Card>

      <Card title="Delivery text">
        <div className="px-4 sm:px-5 py-4 grid gap-4 sm:grid-cols-2">
          <Field name="delivery.dispatchWindow" label="Dispatch time" value={s.delivery.dispatchWindow} />
          <Field name="delivery.transitTime" label="Transit time" value={s.delivery.transitTime} />
        </div>
      </Card>

      <Card title="New order emails">
        <div className="px-4 sm:px-5 py-4">
          <Field name="orderEmails" label="Send a copy of every new order to" value={s.orderEmails.join(', ')} hint="Separate several emails with commas" />
        </div>
      </Card>

      <div className="sticky bottom-20 lg:bottom-4 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur border border-gray-200 shadow-lg p-3">
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? 'Saving…' : 'Save settings'}</button>
        {msg && <p className={`text-sm font-bold ${msg.ok ? 'text-green-700' : 'text-red-700'}`} role="status">{msg.text}</p>}
      </div>
    </form>
  );
}
