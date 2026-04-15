"use client"

import { FadeIn } from "@modules/common/components/animations"
import { Sparkles, Phone, MapPin, Map, Send, CreditCard, User, Globe } from "lucide-react"
import { useState } from "react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    state: "",
    city: "",
    referral: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement submission logic
    console.log("Form submitted:", formData)
    alert("Thank you for your inquiry! Our premium representative will connect with you shortly.")
  }

  return (
    <section className="py-32 bg-white relative overflow-hidden border-t border-surface-border">
      {/* Cinematic background elements */}
      <div className="bg-noise absolute inset-0 pointer-events-none opacity-5"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-maroon/5 rounded-full blur-[150px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="px-6 md:px-12 relative z-10 max-w-[1440px] mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 flex flex-col items-center">
            <FadeIn delay={0.2} direction="down">
              <div className="inline-flex items-center gap-3 bg-brand-cloud px-8 py-3 rounded-full mb-10 border border-surface-border shadow-sm">
                <Sparkles className="h-4 w-4 text-brand-gold" />
                <span className="text-[10px] font-black text-brand-maroon uppercase tracking-[0.4em]">Inquiry Protocol</span>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <h2 className="text-h2 text-brand-carbon mb-8 leading-none uppercase">
                SEND YOUR <span className="text-brand-maroon italic">BIO</span>
              </h2>
              <div className="h-0.5 w-16 bg-brand-maroon mx-auto rounded-full"></div>
            </FadeIn>
          </div>

          <FadeIn delay={0.6}>
            <div className="bg-brand-cloud rounded-[4rem] p-8 md:p-20 border border-surface-border shadow-2xl shadow-brand-maroon/5 relative overflow-hidden">
               <div className="bg-noise absolute inset-0 pointer-events-none opacity-[0.03]"></div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                {/* Your Name */}
                <div className="space-y-4">
                  <label className="text-[10px] text-muted font-black uppercase tracking-[0.4em] block ml-2">
                    Official Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      placeholder="e.g., Alexander Graham"
                      className="w-full bg-white border border-surface-border rounded-3xl px-8 py-5 text-brand-carbon placeholder:text-muted/40 focus:outline-none focus:border-brand-maroon focus:ring-4 focus:ring-brand-maroon/5 transition-all duration-300 shadow-sm font-bold"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <User size={18} className="absolute right-8 top-1/2 -translate-y-1/2 text-muted/30 group-focus-within:text-brand-maroon transition-colors" />
                  </div>
                </div>

                {/* Mobile No */}
                <div className="space-y-4">
                  <label className="text-[10px] text-muted font-black uppercase tracking-[0.4em] block ml-2">
                    Mobile Identifier
                  </label>
                  <div className="relative group">
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="e.g., 9876543210"
                      className="w-full bg-white border border-surface-border rounded-3xl px-8 py-5 text-brand-carbon placeholder:text-muted/40 focus:outline-none focus:border-brand-maroon focus:ring-4 focus:ring-brand-maroon/5 transition-all duration-300 shadow-sm font-bold"
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    />
                    <Phone size={18} className="absolute right-8 top-1/2 -translate-y-1/2 text-muted/30 group-focus-within:text-brand-maroon transition-colors" />
                  </div>
                </div>

                {/* Your Address */}
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] text-muted font-black uppercase tracking-[0.4em] block ml-2">
                    Delivery Coordinates
                  </label>
                  <div className="relative group">
                    <textarea
                      required
                      rows={3}
                      placeholder="Your full delivery address detailing landmarks..."
                      className="w-full bg-white border border-surface-border rounded-[2.5rem] px-8 py-7 text-brand-carbon placeholder:text-muted/40 focus:outline-none focus:border-brand-maroon focus:ring-4 focus:ring-brand-maroon/5 transition-all duration-300 shadow-sm font-bold resize-none"
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                    <MapPin size={18} className="absolute right-8 top-8 text-muted/30 group-focus-within:text-brand-maroon transition-colors" />
                  </div>
                </div>

                {/* Your State */}
                <div className="space-y-4">
                  <label className="text-[10px] text-muted font-black uppercase tracking-[0.4em] block ml-2">
                    Region / State
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      placeholder="e.g., Tamil Nadu"
                      className="w-full bg-white border border-surface-border rounded-3xl px-8 py-5 text-brand-carbon placeholder:text-muted/40 focus:outline-none focus:border-brand-maroon focus:ring-4 focus:ring-brand-maroon/5 transition-all duration-300 shadow-sm font-bold"
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                    <Globe size={18} className="absolute right-8 top-1/2 -translate-y-1/2 text-muted/30 group-focus-within:text-brand-maroon transition-colors" />
                  </div>
                </div>

                {/* Your City */}
                <div className="space-y-4">
                  <label className="text-[10px] text-muted font-black uppercase tracking-[0.4em] block ml-2">
                    Locality / City
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      placeholder="e.g., Sivakasi"
                      className="w-full bg-white border border-surface-border rounded-3xl px-8 py-5 text-brand-carbon placeholder:text-text-muted/40 focus:outline-none focus:border-brand-maroon focus:ring-4 focus:ring-brand-maroon/5 transition-all duration-300 shadow-sm font-bold"
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                    <Map size={18} className="absolute right-8 top-1/2 -translate-y-1/2 text-text-muted/30 group-focus-within:text-brand-maroon transition-colors" />
                  </div>
                </div>

                {/* Submit */}
                <div className="md:col-span-2 pt-10">
                  <button
                    type="submit"
                    className="app-btn app-btn-primary w-full h-20 text-sm tracking-[0.4em] font-black uppercase group"
                  >
                    Submit Bio Data
                    <Send className="ml-3 h-5 w-5 inline transform group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>

              {/* VIP Message */}
              <div className="mt-16 text-center border-t border-surface-border pt-16">
                <div className="inline-block relative">
                  <div className="absolute inset-0 bg-brand-gold/10 blur-xl rounded-full"></div>
                  <p className="relative z-10 text-[10px] font-black text-brand-carbon uppercase tracking-[0.4em]">
                    <span className="text-brand-maroon italic">VIP GIFT BOX</span> STATUS: PRE-BOOKING ACTIVE
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
