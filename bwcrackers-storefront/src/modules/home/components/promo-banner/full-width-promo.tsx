"use client"

import { Sparkles, ArrowRight } from "lucide-react"
import { RealisticFlowerPot } from "@modules/common/components/flower-pot/realistic-flower-pot"

export function FullWidthPromo() {
  const onShopNow = () => {
    const productsSection = document.getElementById("featured-products")
    productsSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden py-24 celebration-bg">
      {/* Background patterns/glows */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-brand-gold-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Realistic Flower Pot Fountain Animation */}
      <div className="absolute inset-x-0 bottom-0 top-0 z-0">
        <RealisticFlowerPot />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <div className="inline-block mb-8">
            <div className="glass-gold px-8 py-3 rounded-full border border-brand-gold-400/30 animate-pulse">
              <span className="flex items-center gap-3 text-brand-gold-200 font-black uppercase tracking-[0.3em] text-xs">
                <Sparkles className="h-4 w-4" />
                Limited Royal Edition
              </span>
            </div>
          </div>

          <h2 className="text-h1 text-white mb-8">
            The Gold <br />
            <span className="text-gold italic">Standard</span>
          </h2>

          <p className="text-2xl text-white/70 mb-12 max-w-2xl font-light leading-relaxed">
            Elevate your festivities with our hand-sourced, premium collection. 
            Crafted for those who demand nothing but the absolute best.
          </p>

          <div className="flex flex-wrap gap-8 items-center">
            <button
              onClick={onShopNow}
              className="premium-btn text-xl px-14 py-6"
            >
              Shop The Selection
              <ArrowRight className="ml-3 h-6 w-6 inline" />
            </button>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 w-12 rounded-full border-2 border-brand-royal-950 bg-brand-gold-500 flex items-center justify-center text-brand-royal-950 font-black text-xs shadow-xl">
                  {i}k+
                </div>
              ))}
              <div className="pl-6 text-white/50 text-sm font-bold uppercase tracking-widest flex items-center">
                Happy Patrons
              </div>
            </div>
          </div>

          {/* Premium Glass Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
            {[
              { val: "80%", label: "Exclusive Discount", theme: "gold" },
              { val: "₹5,000", label: "VIP Min. Order", theme: "white" },
              { val: "Express", label: "Global Shipping", theme: "gold" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="glass-card p-8 rounded-3xl border border-white/5 group hover:border-brand-gold-400/30 transition-all duration-500"
              >
                <div className={`text-4xl font-black mb-2 ${stat.theme === 'gold' ? 'text-gold' : 'text-white'}`}>
                  {stat.val}
                </div>
                <div className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}