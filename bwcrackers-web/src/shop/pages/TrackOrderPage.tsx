'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PackageSearch, Loader2, Check, Truck, Clock, XCircle, IndianRupee, PackageCheck, Home } from 'lucide-react';
import { useShopConstants } from '../context/ShopContext';
import { trackOrder, TrackedOrder } from '../lib/api';
import { formatINR } from '../lib/format';
import WhatsAppIcon from '../components/icons/WhatsAppIcon';

const STEPS: { key: string; label: string; icon: typeof Check; desc: string }[] = [
  { key: 'pending', label: 'Received', icon: Clock, desc: 'We have your order and will call or WhatsApp you to confirm it.' },
  { key: 'confirmed', label: 'Confirmed', icon: Check, desc: 'Stock confirmed — please complete payment.' },
  { key: 'paid', label: 'Paid', icon: IndianRupee, desc: 'Payment received, thank you.' },
  { key: 'packed', label: 'Packed', icon: PackageCheck, desc: 'Sealed and ready for the transporter.' },
  { key: 'dispatched', label: 'Dispatched', icon: Truck, desc: 'On its way — collect from the parcel office when notified.' },
  { key: 'delivered', label: 'Delivered', icon: Home, desc: 'Enjoy a safe and happy Diwali!' },
];

export default function TrackOrderPage() {
  const { WHATSAPP_LINK } = useShopConstants();
  const params = useSearchParams();
  const [ref, setRef] = useState(params.get('ref') ?? '');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  useEffect(() => { setRef(params.get('ref') ?? ''); }, [params]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!ref.trim()) { setError('Enter your order reference (e.g. 01ABC2DE).'); return; }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) { setError('Enter the 10-digit mobile number used for the order.'); return; }
    setLoading(true);
    try {
      const result = await trackOrder(ref, phone);
      setOrder(result);
      window.history.replaceState(null, '', `/track?ref=${encodeURIComponent(ref.replace(/^#/, '').trim())}`);
    } catch (err: any) {
      setOrder(null);
      setError(err?.message || 'We could not find that order. Check the reference and phone number.');
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = order ? STEPS.findIndex(s => s.key === order.status) : -1;
  const cancelled = order?.status === 'cancelled';

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-10 md:py-14 pb-32 min-h-[60vh]">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-navy/5 text-brand-navy flex items-center justify-center"><PackageSearch size={30} /></div>
        <h1 className="section-title">Track your order</h1>
        <p className="text-gray-600 text-sm font-medium mt-2">Enter the reference from your WhatsApp message or estimate PDF, plus the mobile number you ordered with.</p>
      </div>

      <form onSubmit={submit} noValidate className="card p-5 md:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ref" className="label">Order reference</label>
            <input id="ref" value={ref} onChange={e => setRef(e.target.value.toUpperCase())} placeholder="#01ABC2DE" autoComplete="off" className="input uppercase" />
          </div>
          <div>
            <label htmlFor="track-phone" className="label">Mobile number</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-bold text-sm">+91</span>
              <input id="track-phone" type="tel" inputMode="numeric" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit number" autoComplete="tel-national" className="input rounded-l-none" />
            </div>
          </div>
        </div>
        {error && <p role="alert" className="text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
        <button type="submit" disabled={loading} className="btn-navy w-full min-h-[50px]">
          {loading ? <><Loader2 className="animate-spin" size={18} /> Checking…</> : 'Check status'}
        </button>
      </form>

      {order && (
        <section className="card mt-6 overflow-hidden" aria-live="polite">
          <div className="bg-brand-navy text-white px-5 py-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/70">Order {order.reference}</p>
              <p className="font-black text-lg">{order.customer_name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/70 font-bold">Placed</p>
              <p className="font-black text-sm">{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="p-5">
            {cancelled ? (
              <div className="flex gap-3 items-start bg-red-50 border border-red-100 rounded-xl p-4 text-sm">
                <XCircle className="text-red-600 flex-shrink-0" size={20} />
                <div><p className="font-black text-red-700">This order was cancelled</p><p className="text-red-700/80 mt-0.5">If this is unexpected, message us on WhatsApp and we'll sort it out.</p></div>
              </div>
            ) : (
              <ol className="relative space-y-4">
                {STEPS.map((s, i) => {
                  const done = i <= stepIndex;
                  const current = i === stepIndex;
                  const Icon = s.icon;
                  return (
                    <li key={s.key} className="flex gap-4 items-start">
                      <div className="flex flex-col items-center">
                        <span className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${done ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-200 text-gray-400'} ${current ? 'ring-4 ring-green-100' : ''}`}><Icon size={16} /></span>
                        {i < STEPS.length - 1 && <span className={`w-0.5 h-6 mt-1 ${i < stepIndex ? 'bg-green-600' : 'bg-gray-200'}`} />}
                      </div>
                      <div className="pt-1.5">
                        <p className={`font-black text-sm ${done ? 'text-brand-navy' : 'text-gray-400'}`}>{s.label}{current && <span className="ml-2 text-xs font-black text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Current</span>}</p>
                        {current && <p className="text-xs text-gray-600 mt-0.5">{s.desc}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            {order.tracking_number && (
              <div className="mt-5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Parcel / LR number</p>
                <p className="font-black text-brand-navy mt-0.5 break-all">{order.tracking_number}</p>
              </div>
            )}

            <dl className="mt-5 border-t border-gray-100 pt-4 text-sm space-y-1.5">
              {order.items.map((it, i) => (
                <div key={i} className="flex justify-between gap-3"><dt className="text-gray-700">{it.title} × {it.quantity}</dt><dd className="font-bold text-brand-navy tabular-nums">{formatINR(it.unit_price * it.quantity)}</dd></div>
              ))}
              <div className="flex justify-between pt-2 border-t border-gray-100"><dt className="text-gray-600">Items total</dt><dd className="font-black tabular-nums">{formatINR(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Packing fee</dt><dd className="font-black tabular-nums">{formatINR(order.packing_fee)}</dd></div>
              <div className="flex justify-between text-base"><dt className="font-black text-brand-navy">Total</dt><dd className="font-black text-brand-navy tabular-nums">{formatINR(order.grand_total)}</dd></div>
            </dl>

            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full mt-5"><WhatsAppIcon className="w-5 h-5" /> Ask about this order</a>
          </div>
        </section>
      )}

      <p className="text-center text-xs text-gray-500 mt-8">
        Can't find your reference? <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="font-black text-brand-magenta hover:underline">Message us on WhatsApp</a> with your name and we'll look it up.
      </p>
    </div>
  );
}
