"use client"

import { FadeIn } from "@modules/common/components/animations"
import { Sparkles, Phone, MapPin, Map, Send, CreditCard } from "lucide-react"
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
    alert("Thank you for your inquiry! Our royal representative will connect with you shortly.")
  }

  return (
    <section className="py-24 celebration-bg relative overflow-hidden border-t border-white/5">
      {/* Cinematic background elements */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-accent-hot/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <FadeIn delay={0.2} direction="down">
              <div className="inline-flex items-center gap-3 glass-gold px-6 py-2 rounded-full mb-8 border border-brand-gold-400/20 shadow-glow-gold">
                <Sparkles className="h-4 w-4 text-brand-gold-400" />
                <span className="text-display text-brand-gold-200 tracking-[0.2em]">Majestic Inquiries</span>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <h2 className="text-h1 text-white mb-6">
                Send Your <span className="text-gold italic">Bio</span>
              </h2>
            </FadeIn>
          </div>

          <FadeIn delay={0.6}>
            <div className="glass-card rounded-[3rem] p-8 md:p-16 border border-white/10 shadow-glow-gold/10 relative overflow-hidden">
               {/* Internal glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Your Name */}
                <div className="space-y-4">
                  <label className="text-[10px] text-brand-gold-400 font-black uppercase tracking-[0.3em] block ml-1">
                    Your Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      placeholder="e.g., Alexander Graham"
                      className="w-full bg-brand-royal-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-brand-gold-400/50 transition-all duration-300"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:text-brand-gold-400/30 transition-all">
                      Aa
                    </div>
                  </div>
                </div>

                {/* Mobile No */}
                <div className="space-y-4">
                  <label className="text-[10px] text-brand-gold-400 font-black uppercase tracking-[0.3em] block ml-1">
                    Your 10 Digit Mobile No
                  </label>
                  <div className="relative group">
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="e.g., 9876543210"
                      className="w-full bg-brand-royal-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-brand-gold-400/50 transition-all duration-300"
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/5 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:text-brand-gold-400/30 transition-all">
                      <Phone size={18} />
                    </div>
                  </div>
                </div>

                {/* Your Address */}
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] text-brand-gold-400 font-black uppercase tracking-[0.3em] block ml-1">
                    Your Address
                  </label>
                  <div className="relative group">
                    <textarea
                      required
                      rows={3}
                      placeholder="Your full delivery address..."
                      className="w-full bg-brand-royal-950/50 border border-white/10 rounded-[2rem] px-6 py-5 text-white placeholder:text-white/10 focus:outline-none focus:border-brand-gold-400/50 transition-all duration-300 resize-none"
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                    <div className="absolute right-6 top-6 text-white/5 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:text-brand-gold-400/30 transition-all">
                      <MapPin size={18} />
                    </div>
                  </div>
                </div>

                {/* Your State */}
                <div className="space-y-4">
                  <label className="text-[10px] text-brand-gold-400 font-black uppercase tracking-[0.3em] block ml-1">
                    Your State
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      placeholder="e.g., Tamil Nadu"
                      className="w-full bg-brand-royal-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-brand-gold-400/50 transition-all duration-300"
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/5 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:text-brand-gold-400/30 transition-all">
                      <Map size={18} />
                    </div>
                  </div>
                </div>

                {/* Your City */}
                <div className="space-y-4">
                  <label className="text-[10px] text-brand-gold-400 font-black uppercase tracking-[0.3em] block ml-1">
                    Your City
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      placeholder="e.g., Sivakasi"
                      className="w-full bg-brand-royal-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-brand-gold-400/50 transition-all duration-300"
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/5 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:text-brand-gold-400/30 transition-all">
                      <MapPin size={18} />
                    </div>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] text-brand-gold-400 font-black uppercase tracking-[0.3em] block ml-1">
                    Referral code if any
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Optional Referral Code"
                      className="w-full bg-brand-royal-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-brand-gold-400/50 transition-all duration-300"
                      onChange={(e) => setFormData({...formData, referral: e.target.value})}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/5 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:text-brand-gold-400/30 transition-all">
                      <CreditCard size={18} />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="md:col-span-2 pt-8">
                  <button
                    type="submit"
                    className="premium-btn w-full h-16 text-lg tracking-[0.3em] font-black uppercase group"
                  >
                    Submit Bio
                    <Send className="ml-3 h-5 w-5 inline transform group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>

              {/* VIP Message */}
              <div className="mt-12 text-center">
                <div className="glass-gold py-4 px-8 rounded-2xl inline-block border border-brand-gold-400/10 shadow-glow-gold/10">
                  <p className="text-[11px] font-black text-white/80 uppercase tracking-[0.3em]">
                    <span className="text-gold italic">VIP GIFT BOX</span> AVAILABLE FOR PRE-BOOKING ONLY
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
