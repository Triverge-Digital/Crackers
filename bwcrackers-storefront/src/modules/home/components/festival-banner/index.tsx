"use client"

import {
  Sparkles,
  Zap,
  Flame,
  Gift,
  PartyPopper,
} from "lucide-react"
import { FadeIn } from "@modules/common/components/animations"

export function FestivalBanner() {
  const onShopNow = () => {
    const productsSection = document.getElementById("featured-products")
    productsSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative py-24 overflow-hidden celebration-bg">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent-hot/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-royal-700/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-card rounded-[3rem] p-8 md:p-16 border border-white/10 relative overflow-hidden">
          {/* Sparkle effects */}
          <div className="absolute top-10 left-10 animate-sparkle">
            <Sparkles className="h-8 w-8 text-brand-gold-400 opacity-50" />
          </div>
          <div className="absolute bottom-10 right-10 animate-sparkle [animation-delay:1.5s]">
            <PartyPopper className="h-10 w-10 text-brand-accent-pink opacity-50" />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 text-center lg:text-left">
              <FadeIn delay={0.2} direction="right">
                <div className="inline-flex items-center gap-2 glass-gold px-6 py-2 rounded-full mb-8 border border-brand-gold-400/30">
                  <Gift className="h-5 w-5 text-brand-gold-400" />
                  <span className="text-display text-brand-gold-200">
                    VIP Gift Box Pre-Booking
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.4} direction="right">
                <h2 className="text-h2 text-white mb-6">
                  The Ultimate <br />
                  <span className="text-gold">Festival Collection</span>
                </h2>
              </FadeIn>

              <FadeIn delay={0.6} direction="right">
                <p className="text-xl text-white/70 mb-10 leading-relaxed font-light">
                  Don&apos;t wait for the rush. Secure our exclusive VIP Gift Boxes 
                  and handpicked festive combos now. Premium quality crackers 
                  with guaranteed safe delivery to your doorstep.
                </p>
              </FadeIn>

              <FadeIn delay={0.8} direction="right">
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                  <button
                    onClick={onShopNow}
                    className="premium-btn text-lg px-12 py-5"
                  >
                    <Sparkles size={20} className="mr-2 inline" />
                    Pre-Book Now
                  </button>
                  <div className="flex items-center gap-4 text-white/50 font-bold uppercase tracking-widest text-sm">
                    <Flame size={18} className="text-brand-accent-orange" />
                    Limited Units Available
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="flex-1 w-full lg:w-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: "VIP Combo",
                    desc: "Handpicked mega crackers",
                    icon: "🎆",
                    color: "from-brand-gold-400 to-brand-accent-orange",
                  },
                  {
                    title: "Family Box",
                    desc: "Fun for all ages",
                    icon: "🎊",
                    color: "from-brand-royal-700 to-brand-accent-pink",
                  },
                  {
                    title: "Safety First",
                    desc: "100% Certified fireworks",
                    icon: "🛡️",
                    color: "from-emerald-400 to-teal-600",
                  },
                  {
                    title: "Fast Delivery",
                    desc: "Express shipping options",
                    icon: "⚡",
                    color: "from-blue-400 to-indigo-600",
                  },
                ].map((feature, i) => (
                  <FadeIn key={feature.title} delay={0.2 * i} direction="left">
                    <div
                      className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all group"
                    >
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                        {feature.icon}
                      </div>
                      <div className={`text-xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent mb-1`}>
                        {feature.title}
                      </div>
                      <div className="text-sm text-white/50 font-medium">
                        {feature.desc}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
