import React, { useState } from 'react';
import { Copy, Check, ChevronDown } from 'lucide-react';
import { BANK } from '../constants';

type PaymentDetailsProps = {
  referenceNumber: string;
  itemsTotal: number;
  packingFee: number;
  amountToPay: number;
  whatsappShareUrl: string;
  onDone?: () => void;
};

export default function PaymentDetails({
  referenceNumber, itemsTotal, packingFee, amountToPay, whatsappShareUrl, onDone,
}: PaymentDetailsProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [openCard, setOpenCard] = useState<'gpay' | 'bank' | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const CopyBtn = ({ text, k }: { text: string; k: string }) => (
    <button
      onClick={() => copy(text, k)}
      className="flex items-center gap-1 text-[11px] font-black text-pink-400 hover:text-pink-600 transition-colors flex-shrink-0 ml-2"
    >
      {copied === k ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
      {copied === k ? 'Copied!' : 'Copy'}
    </button>
  );

  return (
    <div className="space-y-4">

      {/* Reference + Amount */}
      <div className="bg-[#1A1A4E]/5 border border-[#1A1A4E]/10 rounded-xl px-4 py-3 space-y-2">
        {referenceNumber && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Reference</p>
              <p className="font-black text-[#1A1A4E] text-sm mt-0.5">{referenceNumber}</p>
            </div>
            <CopyBtn text={referenceNumber} k="ref" />
          </div>
        )}
        <div className="border-t border-[#1A1A4E]/10 pt-2 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">Items Total</span>
            <span className="font-black text-[#1A1A4E]">Rs.{itemsTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">Packing Fee (2%)</span>
            <span className="font-black text-[#1A1A4E]">Rs.{packingFee.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm pt-1 border-t border-[#1A1A4E]/10">
            <span className="font-black text-[#1A1A4E]">Amount to Pay</span>
            <span className="font-black text-green-600">Rs.{amountToPay.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Section heading */}
      <div className="text-center">
        <p className="font-black text-[#1A1A4E] text-sm uppercase tracking-wide">Choose Payment Method</p>
        <p className="text-xs text-gray-400 mt-0.5">Tap a card to view details</p>
      </div>

      {/* ── CARD 1: GPay / PhonePe ── */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-green-200">
        <button
          onClick={() => setOpenCard(openCard === 'gpay' ? null : 'gpay')}
          className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white active:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M21.805 10.023H12.02v3.955h5.636c-.243 1.418-1.456 4.148-5.636 4.148-3.39 0-6.157-2.808-6.157-6.267s2.767-6.267 6.157-6.267c1.93 0 3.225.822 3.965 1.532l2.698-2.602C16.83 3.124 14.61 2 12.02 2 6.478 2 2 6.477 2 12s4.478 10 10.02 10c5.786 0 9.625-4.064 9.625-9.786 0-.658-.072-1.161-.16-1.664l-.02-.527z"/></svg>
            </div>
            <div className="text-left">
              <p className="font-black text-sm">GPay / PhonePe</p>
              <p className="text-white/70 text-[11px]">Pay via UPI instantly</p>
            </div>
          </div>
          <ChevronDown size={18} className={`text-white/80 transition-transform duration-300 ${openCard === 'gpay' ? 'rotate-180' : ''}`} />
        </button>

        {openCard === 'gpay' && (
          <div className="bg-white px-5 py-4 space-y-4 border-t border-green-100">
            {/* UPI ID */}
            <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <div>
                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">UPI ID</p>
                <p className="font-black text-[#1A1A4E] text-base mt-0.5">{BANK.upi}</p>
              </div>
              <CopyBtn text={BANK.upi} k="upi" />
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-2">
              <div className="border-2 border-gray-100 rounded-2xl p-3 bg-white shadow-sm">
                <img src="/gpay-qr.jpeg" alt="GPay QR Code" className="w-44 h-44 object-contain" />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Scan to Pay</p>
            </div>

            <p className="text-[11px] text-center text-gray-400">
              Open GPay / PhonePe → Scan QR or enter UPI ID above → Pay Rs.{amountToPay.toLocaleString('en-IN')}
            </p>
          </div>
        )}
      </div>

      {/* ── CARD 2: Bank Transfer ── */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-[#1A1A4E]/20">
        <button
          onClick={() => setOpenCard(openCard === 'bank' ? null : 'bank')}
          className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#1A1A4E] to-[#2D1B6B] text-white active:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.5 1L2 6v2h19V6L11.5 1zm0 2.236L18.056 6H4.944L11.5 3.236zM3 9v11H1v2h21v-2h-2V9h-2v11h-3V9h-2v11h-3V9h-2v11H7V9H3z"/></svg>
            </div>
            <div className="text-left">
              <p className="font-black text-sm">Bank Transfer</p>
              <p className="text-white/70 text-[11px]">NEFT / IMPS / RTGS</p>
            </div>
          </div>
          <ChevronDown size={18} className={`text-white/80 transition-transform duration-300 ${openCard === 'bank' ? 'rotate-180' : ''}`} />
        </button>

        {openCard === 'bank' && (
          <div className="bg-white px-5 py-4 space-y-2.5 border-t border-[#1A1A4E]/10">
            {[
              { label: 'Account Name', value: BANK.name },
              { label: 'Account Number', value: BANK.account, copyKey: 'account' },
              { label: 'Bank', value: BANK.bank },
              { label: 'Branch', value: BANK.branch },
              { label: 'Account Type', value: BANK.type },
              { label: 'IFSC Code', value: BANK.ifsc, copyKey: 'ifsc' },
            ].map(({ label, value, copyKey }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="font-black text-[#1A1A4E] text-xs mt-0.5">{value}</p>
                </div>
                {copyKey && <CopyBtn text={value} k={copyKey} />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share on WhatsApp */}
      <a
        href={whatsappShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-green-500 hover:bg-green-400 active:scale-95 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.855L.057 23.882l6.173-1.616A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.005-1.366l-.358-.213-3.714.974 1.01-3.61-.234-.373A9.783 9.783 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
        Paid? Share Payment Screenshot
      </a>
      <p className="text-[11px] text-center text-gray-400 -mt-2">
        After paying, tap above and attach your payment screenshot in WhatsApp.
      </p>

      {/* Unboxing policy */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <p className="font-black text-amber-700 text-xs uppercase tracking-wide mb-1.5">Important — Unboxing Policy</p>
        <p className="text-xs text-amber-800 font-medium leading-relaxed">
          Claims for damaged or missing items will be accepted <span className="font-black">only if an unboxing video is provided</span> at the time of opening the package.
        </p>
      </div>

      {onDone && (
        <button onClick={onDone} className="w-full bg-gray-100 hover:bg-gray-200 text-[#1A1A4E] font-black py-3.5 rounded-xl transition-colors text-sm">
          Done
        </button>
      )}
    </div>
  );
}
