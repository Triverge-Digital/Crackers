import React, { useState } from 'react';
import { User, Mail, MapPin, Check, Send } from 'lucide-react';
import { pricelist } from '../data/pricelist';
import { Totals } from '../constants';

type OrderEnquiryFormProps = {
  cart: Record<string, number>;
  totals: Totals;
  pricelist: typeof pricelist;
};

export default function OrderEnquiryForm({ cart, totals, pricelist: pl }: OrderEnquiryFormProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const items: { title: string; quantity: number; unit_price: number }[] = [];
      pl.forEach(cat => {
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
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': apiKey,
        },
        body: JSON.stringify({
          customer_name: formData.customer_name.trim(),
          phone: `+91${formData.phone.trim()}`,
          email: formData.email.trim() || undefined,
          address: formData.address.trim() || undefined,
          city: formData.city.trim() || undefined,
          state: formData.state.trim() || undefined,
          pincode: formData.pincode.trim() || undefined,
          notes: formData.notes.trim() || undefined,
          items,
          subtotal: totals.total,
          currency_code: 'inr',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to place order');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-black text-brand-purple mb-2 font-display">Order Placed Successfully!</h3>
        <p className="text-gray-500 mb-1">
          Thank you, <span className="text-brand-magenta font-bold">{formData.customer_name}</span>!
        </p>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Our team will contact you at <span className="text-brand-magenta font-bold">+91 {formData.phone}</span> to confirm your order and arrange delivery.
        </p>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl max-w-xs mx-auto">
          <p className="text-xs text-amber-700 font-bold">No payment charged. Payment upon delivery.</p>
        </div>
      </div>
    );
  }

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-brand-magenta/40 focus:bg-white transition-all text-sm";
  const labelClass = "text-xs text-gray-500 font-bold block mb-1.5";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-black text-brand-purple uppercase tracking-tight">Your Details</h2>
        <p className="text-gray-400 text-sm mt-1">Fill in your details and our team will contact you to confirm your order.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name <span className="text-red-400">*</span></label>
            <div className="relative">
              <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} placeholder="Enter your full name" className={inputClass} required />
              <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Phone Number <span className="text-red-400">*</span></label>
            <div className="flex">
              <span className="inline-flex items-center px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-400 font-bold text-sm">+91</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setFormData(prev => ({ ...prev, phone: val })); setError(''); }}
                placeholder="10-digit mobile number"
                className={`${inputClass} !rounded-l-none`}
                maxLength={10}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <div className="relative">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com (optional)" className={inputClass} />
            <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Delivery Address</label>
          <div className="relative">
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street address, area, landmark" className={inputClass} />
            <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 6); setFormData(prev => ({ ...prev, pincode: val })); }}
              placeholder="6-digit"
              maxLength={6}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Notes / Special Requests</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any special requests..." rows={3} className={`${inputClass} resize-none`} />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-sm text-red-500 font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-magenta hover:bg-brand-magenta/90 text-white font-black text-sm uppercase tracking-wider py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Placing Order...
            </>
          ) : (
            <>Place Order <Send size={16} /></>
          )}
        </button>

        <p className="text-[11px] text-gray-400 text-center">
          By placing this order, you agree to be contacted regarding your order. No online payment will be charged.
        </p>
      </form>
    </div>
  );
}
