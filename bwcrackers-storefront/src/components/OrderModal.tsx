import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MapPin, Mail } from 'lucide-react';
import { deriveReferenceNumber, buildPaymentShareWhatsAppUrl } from '../lib/whatsappOrder';
import { pricelist } from '../data/pricelist';
import { Totals } from '../constants';
import { generateEstimatePDF } from '../lib/generateEstimatePDF';
import PaymentDetails from './PaymentDetails';

export type CustomerForm = { name: string; phone: string; email: string; address: string };

type OrderModalProps = {
  open: boolean;
  onClose: () => void;
  cart: Record<string, number>;
  totals: Totals;
  form: CustomerForm;
  setForm: React.Dispatch<React.SetStateAction<CustomerForm>>;
};

export default function OrderModal({ open, onClose, cart, totals, form, setForm }: OrderModalProps) {
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const packingFee = Math.ceil(totals.total * 0.02);
  const grandTotal = totals.total + packingFee;

  // Build ordered items list from cart + pricelist
  const orderedItems = React.useMemo(() => {
    const result: Array<{ name: string; unit: string; qty: number; price: number; total: number }> = [];
    pricelist.forEach(cat => {
      cat.products.forEach(p => {
        const qty = cart[p.code];
        if (qty) result.push({ name: p.name, unit: p.unit, qty, price: p.discountPrice, total: p.discountPrice * qty });
      });
    });
    return result;
  }, [cart]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!/^\d{10}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit number';
    if (!form.address.trim()) e.address = 'Please enter your delivery address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOrder = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const localRef = `BW${Date.now().toString(36).toUpperCase().slice(-6)}`;
    let ref = localRef;

    try {
      const items: { title: string; quantity: number; unit_price: number }[] = [];
      pricelist.forEach(cat => {
        cat.products.forEach(p => {
          if (cart[p.code]) {
            items.push({ title: p.name, quantity: cart[p.code], unit_price: p.discountPrice });
          }
        });
      });

      const backendUrl = (import.meta as any).env?.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
      const apiKey = (import.meta as any).env?.VITE_MEDUSA_PUBLISHABLE_KEY || '';

      const response = await fetch(`${backendUrl}/store/order-enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': apiKey },
        body: JSON.stringify({
          customer_name: form.name.trim(),
          phone: `+91${form.phone.trim()}`,
          address: form.address.trim(),
          items,
          subtotal: totals.total,
          currency_code: 'inr',
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        ref = deriveReferenceNumber(data?.order_enquiry?.id) || localRef;
      }
    } catch {
      // Backend unavailable — proceed with local reference
    }

    setReference(ref);

    const customer = { name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), address: form.address.trim() };

    // Build items list for email
    const emailItems: { name: string; unit: string; qty: number; price: number; total: number }[] = [];
    pricelist.forEach(cat => {
      cat.products.forEach(p => {
        const qty = cart[p.code];
        if (qty) emailItems.push({ name: p.name, unit: p.unit, qty, price: p.discountPrice, total: p.discountPrice * qty });
      });
    });

    // Send confirmation email (best-effort, non-blocking)
    fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, items: emailItems, itemsTotal: totals.total, packingFee, grandTotal, reference: ref }),
    }).catch(() => {});

    generateEstimatePDF(cart, pricelist, customer, ref, totals.total, packingFee, grandTotal);
    setStep('payment');
    setSubmitting(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setStep('details'); setErrors({}); }, 400);
  };

  const inputClass = (field: string) =>
    `w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
      errors[field] ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-pink-400'
    }`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-[100] px-0 sm:px-4"
          >
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">

              {/* Header */}
              <div className="bg-[#1A1A4E] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div>
                  <p className="text-white font-black text-base">
                    {step === 'details' ? 'Place Your Order' : 'Order Confirmed!'}
                  </p>
                  <p className="text-white/60 text-xs mt-0.5">
                    {step === 'details' ? 'Enter your details to place your order' : 'Choose a payment method below'}
                  </p>
                </div>
                <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white flex-shrink-0">
                  <X size={16} />
                </button>
              </div>

              {/* ── STEP 1: DETAILS ── */}
              {step === 'details' && (
                <div className="px-6 pt-4 pb-6 space-y-4">

                  {/* Ordered Items */}
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="bg-[#1A1A4E]/5 px-4 py-2 border-b border-gray-100">
                      <p className="text-[11px] font-black text-[#1A1A4E] uppercase tracking-widest">Your Order ({orderedItems.length} item{orderedItems.length !== 1 ? 's' : ''})</p>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-40 overflow-y-auto">
                      {orderedItems.map((item, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-2.5">
                          <div className="flex-1 min-w-0 pr-3">
                            <p className="text-xs font-black text-[#1A1A4E] truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{item.unit} × {item.qty}</p>
                          </div>
                          <p className="text-xs font-black text-[#1A1A4E] flex-shrink-0">Rs.{item.total.toLocaleString('en-IN')}</p>
                        </div>
                      ))}
                    </div>
                    {/* Totals */}
                    <div className="bg-gray-50 px-4 py-3 space-y-1.5 border-t border-gray-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-medium">Items Total</span>
                        <span className="font-black text-[#1A1A4E]">Rs.{totals.total.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-medium">Packing Fee (2%)</span>
                        <span className="font-black text-[#1A1A4E]">Rs.{packingFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-1.5 flex justify-between">
                        <span className="font-black text-sm text-[#1A1A4E]">Total Amount</span>
                        <span className="font-black text-green-600 text-sm">Rs.{grandTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1.5">Your Name <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ravi Kumar" className={inputClass('name')} autoFocus />
                      <User size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 font-medium mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1.5">Mobile Number <span className="text-red-400">*</span></label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 font-bold text-sm">+91</span>
                      <input
                        type="tel" name="phone" value={form.phone}
                        onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setForm(prev => ({ ...prev, phone: val })); setErrors(prev => ({ ...prev, phone: '' })); }}
                        placeholder="10-digit number" maxLength={10}
                        className={`${inputClass('phone')} rounded-l-none`}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 font-medium mt-1">{errors.phone}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1.5">Email ID <span className="text-gray-300 font-medium normal-case tracking-normal">(optional)</span></label>
                    <div className="relative">
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="e.g. ravi@gmail.com" className={inputClass('email')} />
                      <Mail size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1.5">Delivery Address <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <textarea name="address" value={form.address} onChange={handleChange} placeholder="Street, area, city, pincode" rows={3} className={`${inputClass('address')} resize-none pb-2 pr-8`} />
                      <MapPin size={15} className="absolute right-3 top-3 text-gray-300" />
                    </div>
                    {errors.address && <p className="text-xs text-red-500 font-medium mt-1">{errors.address}</p>}
                  </div>

                  <button
                    onClick={handleOrder}
                    disabled={submitting}
                    className="w-full bg-green-500 hover:bg-green-400 active:scale-95 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.855L.057 23.882l6.173-1.616A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.005-1.366l-.358-.213-3.714.974 1.01-3.61-.234-.373A9.783 9.783 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                        Place Order
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-gray-400">Your order will be sent to us. Payment can be done manually after confirmation.</p>
                </div>
              )}

              {/* ── STEP 2: PAYMENT ── */}
              {step === 'payment' && (
                <div className="px-6 pt-4 pb-6 space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
                    <p className="text-green-700 font-black text-sm">Order placed successfully!</p>
                    <p className="text-green-600 text-xs mt-0.5">Your estimate PDF has been opened. We will confirm shortly.</p>
                  </div>

                  {/* Re-download estimate */}
                  <button
                    onClick={() => generateEstimatePDF(cart, pricelist, { name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), address: form.address.trim() }, reference, totals.total, packingFee, grandTotal)}
                    className="w-full bg-[#1A1A4E] hover:bg-[#2D1B6B] active:scale-95 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download Estimate PDF
                  </button>

                  <PaymentDetails
                    referenceNumber={reference}
                    itemsTotal={totals.total}
                    packingFee={packingFee}
                    amountToPay={grandTotal}
                    whatsappShareUrl={buildPaymentShareWhatsAppUrl(reference, grandTotal)}
                    onDone={handleClose}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
