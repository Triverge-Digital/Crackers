'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, Landmark, Smartphone } from 'lucide-react';
import { useShopConstants } from '../../context/ShopContext';
import { formatINR } from '../../lib/format';
import WhatsAppIcon from '../icons/WhatsAppIcon';

type Props = {
  referenceNumber: string;
  itemsTotal: number;
  packingFee: number;
  amountToPay: number;
  whatsappShareUrl: string;
  defaultOpen?: 'gpay' | 'bank' | null;
};

export default function PaymentDetails({ referenceNumber, itemsTotal, packingFee, amountToPay, whatsappShareUrl, defaultOpen = 'gpay' }: Props) {
  const { BANK } = useShopConstants();
  const [copied, setCopied] = useState<string | null>(null);
  const [openCard, setOpenCard] = useState<'gpay' | 'bank' | null>(defaultOpen);

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const CopyBtn = ({ text, k, label }: { text: string; k: string; label: string }) => (
    <button
      type="button"
      onClick={() => copy(text, k)}
      aria-label={`Copy ${label}`}
      className="inline-flex items-center gap-1 text-xs font-black text-brand-magenta hover:text-[#c9006e] transition-colors flex-shrink-0 ml-2 min-h-[36px] px-2 rounded-lg hover:bg-brand-magenta/5"
    >
      {copied === k ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
      {copied === k ? 'Copied' : 'Copy'}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="bg-brand-navy/5 border border-brand-navy/10 rounded-xl px-4 py-3 space-y-2">
        {referenceNumber && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Order reference</p>
              <p className="font-black text-brand-navy text-base mt-0.5 tabular-nums">{referenceNumber}</p>
            </div>
            <CopyBtn text={referenceNumber} k="ref" label="order reference" />
          </div>
        )}
        <dl className="border-t border-brand-navy/10 pt-2 space-y-1 text-sm">
          <div className="flex justify-between"><dt className="text-gray-600 font-medium">Items total</dt><dd className="font-black text-brand-navy">{formatINR(itemsTotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-600 font-medium">Packing fee (2%)</dt><dd className="font-black text-brand-navy">{formatINR(packingFee)}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-600 font-medium">Transport</dt><dd className="font-bold text-gray-500 italic">Paid at parcel office</dd></div>
          <div className="flex justify-between pt-1.5 border-t border-brand-navy/10 text-base"><dt className="font-black text-brand-navy">Amount to pay now</dt><dd className="font-black text-green-700">{formatINR(amountToPay)}</dd></div>
        </dl>
      </div>

      <div className="text-center">
        <p className="font-black text-brand-navy text-sm uppercase tracking-wide">Choose a payment method</p>
        <p className="text-xs text-gray-500 mt-0.5">Pay only after we confirm your order.</p>
      </div>

      {/* UPI */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-green-200">
        <button
          type="button"
          onClick={() => setOpenCard(openCard === 'gpay' ? null : 'gpay')}
          aria-expanded={openCard === 'gpay'}
          className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white"
        >
          <span className="flex items-center gap-3 text-left">
            <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"><Smartphone size={18} /></span>
            <span>
              <span className="block font-black text-sm">GPay / PhonePe / any UPI app</span>
              <span className="block text-white/80 text-xs">Instant · no charges</span>
            </span>
          </span>
          <ChevronDown size={20} className={`transition-transform duration-300 ${openCard === 'gpay' ? 'rotate-180' : ''}`} />
        </button>
        {openCard === 'gpay' && (
          <div className="bg-white px-5 py-4 space-y-4 border-t border-green-100">
            <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs font-black text-green-700 uppercase tracking-widest">UPI number</p>
                <p className="font-black text-brand-navy text-lg mt-0.5 tabular-nums">{BANK.upi}</p>
              </div>
              <CopyBtn text={BANK.upi} k="upi" label="UPI number" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="border-2 border-gray-100 rounded-2xl p-3 bg-white shadow-sm">
                <img src={BANK.qrImage} alt={`UPI QR code for ${BANK.upi}`} width={176} height={176} className="w-44 h-44 object-contain" loading="lazy" />
              </div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Scan to pay {formatINR(amountToPay)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bank */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-brand-navy/20">
        <button
          type="button"
          onClick={() => setOpenCard(openCard === 'bank' ? null : 'bank')}
          aria-expanded={openCard === 'bank'}
          className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-brand-navy to-[#2D1B6B] text-white"
        >
          <span className="flex items-center gap-3 text-left">
            <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"><Landmark size={18} /></span>
            <span>
              <span className="block font-black text-sm">Bank transfer</span>
              <span className="block text-white/80 text-xs">NEFT / IMPS / RTGS</span>
            </span>
          </span>
          <ChevronDown size={20} className={`transition-transform duration-300 ${openCard === 'bank' ? 'rotate-180' : ''}`} />
        </button>
        {openCard === 'bank' && (
          <dl className="bg-white px-5 py-3 border-t border-brand-navy/10 divide-y divide-gray-50">
            {[
              { label: 'Account name', value: BANK.name },
              { label: 'Account number', value: BANK.account, copyKey: 'account' },
              { label: 'Bank', value: BANK.bank },
              { label: 'Branch', value: BANK.branch },
              { label: 'Account type', value: BANK.type },
              { label: 'IFSC code', value: BANK.ifsc, copyKey: 'ifsc' },
            ].map(({ label, value, copyKey }) => (
              <div key={label} className="flex items-center justify-between py-2">
                <div>
                  <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</dt>
                  <dd className="font-black text-brand-navy text-sm mt-0.5">{value}</dd>
                </div>
                {copyKey && <CopyBtn text={value} k={copyKey} label={label} />}
              </div>
            ))}
          </dl>
        )}
      </div>

      <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">
        <WhatsAppIcon className="w-5 h-5" /> Paid? Share the payment screenshot
      </a>
      <p className="text-xs text-center text-gray-500 -mt-2">
        Attach your payment screenshot in WhatsApp so we can confirm and pack your order.
      </p>
    </div>
  );
}
