'use client';

import { useState } from 'react';
import { Copy, Check, Smartphone, Landmark } from 'lucide-react';
import { useShopConstants } from '../../context/ShopContext';

export default function HowToPaySection() {
  const { BANK } = useShopConstants();
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };
  const CopyBtn = ({ text, k, label, tone = 'green' }: { text: string; k: string; label: string; tone?: 'green' | 'pink' }) => (
    <button
      type="button"
      onClick={() => copy(text, k)}
      aria-label={`Copy ${label}`}
      className={`inline-flex items-center gap-1 text-xs font-black border rounded-lg px-3 min-h-[36px] transition-colors flex-shrink-0 ${
        tone === 'green' ? 'text-green-700 border-green-200 hover:bg-green-50' : 'text-brand-magenta border-pink-100 hover:bg-pink-50'
      }`}
    >
      {copied === k ? <Check size={14} /> : <Copy size={14} />} {copied === k ? 'Copied' : 'Copy'}
    </button>
  );

  return (
    <section id="payment-info" className="py-14 md:py-16 px-4 bg-brand-cream border-t border-gray-100 scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="eyebrow mb-2">Payment</p>
          <h2 className="section-title">How to pay</h2>
          <p className="text-gray-600 text-sm font-medium mt-2">Pay <span className="font-black text-brand-navy">after</span> we confirm your order. Quote your order reference with every payment.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card overflow-hidden border-green-200">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-4 flex items-center gap-3 text-white">
              <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"><Smartphone size={20} /></span>
              <div>
                <p className="font-black text-sm">GPay / PhonePe / any UPI</p>
                <p className="text-white/80 text-xs">Instant, no charges</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black text-green-700 uppercase tracking-widest">UPI number</p>
                  <p className="font-black text-brand-navy text-lg mt-0.5 tabular-nums">{BANK.upi}</p>
                </div>
                <CopyBtn text={BANK.upi} k="upi" label="UPI number" />
              </div>
              <div className="flex justify-center">
                <figure className="border-2 border-gray-100 rounded-2xl p-3 bg-white shadow-sm inline-block text-center">
                  <img src={BANK.qrImage} alt={`UPI QR code for ${BANK.upi}`} width={160} height={160} loading="lazy" className="w-40 h-40 object-contain" />
                  <figcaption className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">Scan to pay</figcaption>
                </figure>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden border-brand-navy/20">
            <div className="bg-gradient-to-r from-brand-navy to-[#2D1B6B] px-5 py-4 flex items-center gap-3 text-white">
              <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"><Landmark size={20} /></span>
              <div>
                <p className="font-black text-sm">Bank transfer</p>
                <p className="text-white/80 text-xs">NEFT / IMPS / RTGS</p>
              </div>
            </div>
            <dl className="p-5 divide-y divide-gray-50">
              {[
                { label: 'Account name', value: BANK.name },
                { label: 'Account number', value: BANK.account, copy: true },
                { label: 'Bank', value: BANK.bank },
                { label: 'Branch', value: BANK.branch },
                { label: 'Account type', value: BANK.type },
                { label: 'IFSC code', value: BANK.ifsc, copy: true },
              ].map(({ label, value, copy: canCopy }) => (
                <div key={label} className="flex items-center justify-between gap-3 py-2">
                  <div>
                    <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</dt>
                    <dd className="font-black text-brand-navy text-sm mt-0.5">{value}</dd>
                  </div>
                  {canCopy && <CopyBtn text={value} k={label} label={label} tone="pink" />}
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
