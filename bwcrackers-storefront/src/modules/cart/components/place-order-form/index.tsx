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
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <Check className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">
          Order Placed Successfully!
        </h3>
        <p className="text-white/60 mb-1">
          Thank you, <span className="text-brand-gold-400 font-bold">{formData.customer_name}</span>!
        </p>
        <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
          Our team will contact you at{" "}
          <span className="text-brand-gold-400 font-bold">+91 {formData.phone}</span> to confirm
          your order and arrange delivery.
        </p>
        <div className="mt-6 p-4 bg-brand-gold-400/10 border border-brand-gold-400/20 rounded-xl max-w-sm mx-auto">
          <p className="text-xs text-brand-gold-400 font-bold uppercase tracking-wider">
            No payment charged. Payment upon delivery.
          </p>
        </div>
      </div>
    )
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-gold-400/50 focus:bg-white/[0.07] transition-all text-sm"
  const labelClass =
    "text-xs text-white/60 font-bold block mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1: Name + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Full Name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={inputClass}
              required
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/15">
              <User size={16} />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Phone Number <span className="text-red-400">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 py-3 bg-white/5 border border-r-0 border-white/10 rounded-l-xl text-white/40 font-bold text-sm">
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
              placeholder="10-digit mobile number"
              className={`${inputClass} !rounded-l-none`}
              maxLength={10}
              required
            />
          </div>
        </div>
      </div>

      {/* Row 2: Email */}
      <div>
        <label className={labelClass}>Email</label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com (optional)"
            className={inputClass}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/15">
            <Mail size={16} />
          </div>
        </div>
      </div>

      {/* Row 3: Address */}
      <div>
        <label className={labelClass}>Delivery Address</label>
        <div className="relative">
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address, area, landmark"
            className={inputClass}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/15">
            <MapPin size={16} />
          </div>
        </div>
      </div>

      {/* Row 4: City, State, Pincode */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className={inputClass}
          />
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
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6)
              setFormData((prev) => ({ ...prev, pincode: val }))
            }}
            placeholder="6-digit pincode"
            maxLength={6}
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 5: Notes */}
      <div>
        <label className={labelClass}>Notes / Special Requests</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any special requests for your order..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-sm text-red-400 font-medium">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-gold-400 hover:bg-brand-gold-500 text-brand-royal-950 font-black text-sm uppercase tracking-wider py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <div className="h-4 w-4 rounded-full border-2 border-brand-royal-950/30 border-t-brand-royal-950 animate-spin" />
            Placing Order...
          </>
        ) : (
          <>
            Place Order
            <Send className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-[11px] text-white/30 text-center">
        By placing this order, you agree to be contacted regarding your order. No online payment will be charged.
      </p>
    </form>
  )
}

export default PlaceOrderForm
