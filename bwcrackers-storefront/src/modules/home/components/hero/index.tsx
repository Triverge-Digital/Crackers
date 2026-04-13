"use client"

import Image from "next/image"
import { Zap } from "lucide-react"
import { FadeIn } from "@modules/common/components/animations"

export function HeroSection() {
  const onShopNow = () => {
    const productsSection = document.getElementById("featured-products")
    productsSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden celebration-bg">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-celebration.png"
          alt="Celebrating Firecrackers"
          fill
          priority
          className="opacity-40 scale-105 animate-float pointer-events-none object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-royal-950 via-brand-royal-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-royal-950/80 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-5xl">
          <div className="space-y-8">
            <FadeIn delay={0.2}>
              <div className="inline-flex items-center gap-3 glass-gold px-6 py-2 rounded-full shadow-glow-gold">
                <span className="flex h-2 w-2 rounded-full bg-brand-gold-400 animate-ping"></span>
                <span className="text-display text-brand-gold-200">
                  Premium 2025 Collection Live
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="space-y-2">
                <h1 className="text-h1 text-white">
                  Ignite Your <br />
                  <span className="text-gold italic">Celebrations</span>
                </h1>
                <div className="h-1.5 w-40 bg-gradient-to-r from-brand-gold-400 to-transparent rounded-full opacity-50"></div>
              </div>
            </FadeIn>

            <FadeIn delay={0.6}>
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl leading-relaxed font-light">
                Experience the pinnacle of pyrotechnics with B&W Crackers. 
                Sourced from the heart of Sivakasi, crafted for your most 
                precious moments.
              </p>
            </FadeIn>

            <FadeIn delay={0.8}>
              <div className="flex flex-wrap gap-6 pt-4">
                <button
                  onClick={onShopNow}
                  className="premium-btn text-lg px-12 py-5"
                >
                  Explore Pricelist
                </button>
                <button
                  onClick={onShopNow}
                  className="ghost-gold text-lg px-10 py-5 rounded-full font-bold transition-all"
                >
                  View Combos
                </button>
              </div>
            </FadeIn>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12">
              {[
                { label: "800+", sub: "Varieties", theme: "brand-gold-400" },
                { label: "100%", sub: "Safe & Certified", theme: "brand-accent-pink" },
                { label: "PAN", sub: "India Delivery", theme: "brand-gold-600" },
              ].map((stat, i) => (
                <FadeIn key={i} delay={1 + i * 0.1} direction="right">
                  <div className={`border-l-2 border-${stat.theme}/30 pl-6 group transition-all hover:border-${stat.theme}`}>
                    <div className="text-4xl font-black text-white group-hover:text-gold transition-colors tracking-tight">
                      {stat.label}
                    </div>
                    <div className="text-sm font-bold text-white/50 uppercase tracking-[0.2em] pt-1">
                      {stat.sub}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Floating Elements */}
      <FadeIn delay={1.5} direction="left" className="absolute bottom-10 right-10 hidden xl:block">
        <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden group animate-float">
          <div className="absolute top-0 right-0 p-2 text-brand-gold-400 animate-sparkle">✨</div>
          <div className="text-sm uppercase tracking-widest text-white/60 mb-2 font-bold">
            Diwali Special
          </div>
          <div className="text-5xl font-black text-gold">UP TO 80%</div>
          <div className="text-xl font-serif text-white/90">Exclusive Discount</div>
          <div className="mt-4 flex items-center gap-2 text-brand-gold-400 font-bold group-hover:gap-4 transition-all cursor-pointer">
            Early Bird Offer <Zap size={16} fill="currentColor" />
          </div>
        </div>
      </FadeIn>
    </section>
  )
}