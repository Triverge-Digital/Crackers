import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MapPin } from 'lucide-react';
import { buildWhatsAppOrderUrl } from '../lib/whatsappOrder';
import { Totals } from '../constants';

type OrderModalProps = {
  open: boolean;
  onClose: () => void;
  cart: Record<string, number>;
  totals: Totals;
};

export default function OrderModal({ open, onClose, cart, totals }: OrderModalProps) {
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleOrder = () => {
    if (!validate()) return;
    const url = buildWhatsAppOrderUrl(cart, totals.total, {
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    });
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const inputClass = (field: string) =>
    `w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
      errors[field] ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-pink-400'
    }`;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-[100] px-0 sm:px-4"
          >
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#1A1A4E] px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-black text-base">Almost there! 🎆</p>
                  <p className="text-white/60 text-xs mt-0.5">Enter your details so we can deliver your order</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                  <X size={16} />
                </button>
              </div>

              {/* Order summary pill */}
              <div className="mx-6 mt-4 bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-bold text-green-700">Your Order Total</span>
                <span className="text-base font-black text-green-700">₹{totals.total.toLocaleString()}</span>
              </div>

              {/* Form */}
              <div className="px-6 pt-4 pb-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1.5">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Ravi Kumar"
                      className={inputClass('name')}
                      autoFocus
                    />
                    <User size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 font-medium mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1.5">
                    Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 font-bold text-sm">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setForm(prev => ({ ...prev, phone: val }));
                        setErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      placeholder="10-digit number"
                      maxLength={10}
                      className={`${inputClass('phone')} rounded-l-none`}
                    />
                    <Phone size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 font-medium mt-1">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1.5">
                    Delivery Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Street, area, city, pincode"
                      rows={2}
                      className={`${inputClass('address')} resize-none`}
                    />
                    <MapPin size={15} className="absolute right-3 top-3 text-gray-300" />
                  </div>
                  {errors.address && <p className="text-xs text-red-500 font-medium mt-1">{errors.address}</p>}
                </div>

                {/* Submit */}
                <button
                  onClick={handleOrder}
                  className="w-full bg-green-500 hover:bg-green-400 active:scale-95 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm mt-2"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.855L.057 23.882l6.173-1.616A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.005-1.366l-.358-.213-3.714.974 1.01-3.61-.234-.373A9.783 9.783 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                  </svg>
                  Send Order on WhatsApp
                </button>

                <p className="text-[11px] text-center text-gray-400">Payment is collected on delivery. No online payment required.</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
