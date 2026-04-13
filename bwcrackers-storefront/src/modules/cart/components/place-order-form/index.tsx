"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Send, Phone, MapPin, Mail, User, FileText, Map, Hash, Check } from "lucide-react"

type PlaceOrderFormProps = {
  cart: HttpTypes.StoreCart
}

const PlaceOrderForm = ({ cart }: PlaceOrderFormProps) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.customer_name.trim()) {
      setError("Please enter your name.")
      return
    }

    if (!formData.phone.trim() || formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.")
      return
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      setError("Phone number must be 10 digits only.")
      return
    }

    setSubmitting(true)

    try {
      const items = cart.items?.map((item) => ({
        title: item.product_title,
        variant_title: item.variant?.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        thumbnail: item.thumbnail,
      }))

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/order-enquiry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
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
            subtotal: cart.subtotal || 0,
            currency_code: cart.currency_code,
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to place order")
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <Check className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-black text-white mb-3 font-serif">
          Order Placed Successfully!
        </h3>
        <p className="text-white/60 mb-2">
          Thank you, <span className="text-gold font-bold">{formData.customer_name}</span>!
        </p>
        <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
          We have received your order. Our team will contact you at{" "}
          <span className="text-brand-gold-400 font-bold">+91 {formData.phone}</span> to confirm
          your order and arrange delivery.
        </p>
        <div className="mt-8 p-5 glass-gold border border-brand-gold-400/20 rounded-2xl max-w-sm mx-auto">
          <p className="text-[11px] text-brand-gold-400 font-bold uppercase tracking-widest leading-relaxed">
            No payment charged. Payment upon delivery.
          </p>
        </div>
      </div>
    )
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-gold-400/50 focus:bg-white/[0.07] transition-all duration-300 text-sm"
  const labelClass =
    "text-[10px] text-brand-gold-400 font-black uppercase tracking-[0.25em] block mb-2 ml-1"

  return (
    <div>
      {/* Info banner */}
      <div className="mb-10 p-5 glass-gold border border-brand-gold-400/20 rounded-2xl">
        <p className="text-sm text-white/60 font-medium text-center leading-relaxed">
          No online payment required. Our team will contact you to confirm the order and arrange delivery.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Row 1: Name + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>
              Full Name <span className="text-brand-accent-hot">*</span>
            </label>
            <div className="relative group">
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputClass}
                required
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-brand-gold-400/30 transition-colors">
                <User size={16} />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Phone Number <span className="text-brand-accent-hot">*</span>
            </label>
            <div className="relative group">
              <div className="flex">
                <span className="inline-flex items-center px-4 py-4 bg-white/5 border border-r-0 border-white/10 rounded-l-2xl text-white/40 font-bold text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10)
                    setFormData((prev) => ({ ...prev, phone: val }))
                    setError("")
                  }}
                  placeholder="10-digit mobile"
                  className={`${inputClass} !rounded-l-none`}
                  maxLength={10}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Email + Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Email</label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com (optional)"
                className={inputClass}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-brand-gold-400/30 transition-colors">
                <Mail size={16} />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Delivery Address</label>
            <div className="relative group">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, landmark"
                className={inputClass}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-brand-gold-400/30 transition-colors">
                <MapPin size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: City, State, Pincode */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>City</label>
            <div className="relative group">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className={inputClass}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-brand-gold-400/30 transition-colors">
                <Map size={16} />
              </div>
            </div>
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Pincode</label>
            <div className="relative group">
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6)
                  setFormData((prev) => ({ ...prev, pincode: val }))
                }}
                placeholder="6-digit"
                maxLength={6}
                className={inputClass}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-brand-gold-400/30 transition-colors">
                <Hash size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Notes */}
        <div>
          <label className={labelClass}>Notes / Special Requests</label>
          <div className="relative group">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special requests for your order..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
            <div className="absolute right-5 top-5 text-white/10 group-focus-within:text-brand-gold-400/30 transition-colors">
              <FileText size={16} />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-brand-accent-hot/10 border border-brand-accent-hot/20 rounded-2xl">
            <p className="text-sm text-brand-accent-hot font-medium">{error}</p>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="premium-btn w-full h-16 text-lg tracking-[0.2em] font-black uppercase group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-brand-royal-950/30 border-t-brand-royal-950 animate-spin" />
                Placing Order...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                Place Order
                <Send className="h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            )}
          </button>
        </div>

        <p className="text-[10px] text-white/20 text-center uppercase tracking-widest font-bold">
          By placing this order, you agree to be contacted regarding your order
        </p>
      </form>
    </div>
  )
}

export default PlaceOrderForm
