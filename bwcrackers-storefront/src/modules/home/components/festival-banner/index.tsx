import {
  Sparkles,
  Flame,
  Gift,
  PartyPopper,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { FadeIn } from "@modules/common/components/animations"
import { ScrollToProductsButton } from "@modules/common/components/scroll-to-products"

export function FestivalBanner() {
  return (
    <section className="relative py-32 overflow-hidden bg-brand-cloud">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-white opacity-50 blur-3xl -z-10"></div>
      
      <div className="px-6 md:px-12 relative z-10 max-w-[1440px] mx-auto">
        <div className="bg-white rounded-[4rem] p-10 md:p-24 border border-surface-border shadow-[0_45px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          {/* Noise effect */}
          <div className="bg-noise absolute inset-0 pointer-events-none opacity-5"></div>
          
          {/* Design accents */}
          <div className="absolute top-10 left-10 animate-pulse">
            <Sparkles className="h-10 w-10 text-brand-gold opacity-20" />
          </div>
          <div className="absolute bottom-10 right-10 animate-bounce">
            <PartyPopper className="h-12 w-12 text-brand-maroon opacity-10" />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
            <div className="flex-1 text-center lg:text-left">
              <FadeIn delay={0.2} direction="right">
                <div className="inline-flex items-center gap-3 bg-brand-cloud px-8 py-3 rounded-full mb-12 border border-surface-border shadow-sm">
                  <Gift className="h-5 w-5 text-brand-maroon" />
                  <span className="text-[10px] font-black text-brand-carbon uppercase tracking-[0.4em]">
                    VIP Gift Box Pre-Booking
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.4} direction="right">
                <h2 className="text-h2 text-brand-carbon mb-10 leading-[0.9] max-w-xl">
                  THE ULTIMATE <br />
                  <span className="text-brand-maroon italic">FESTIVAL BOX</span>
                </h2>
              </FadeIn>

              <FadeIn delay={0.6} direction="right">
                <p className="text-xl text-secondary mb-14 leading-relaxed font-bold max-w-lg">
                  Secure our exclusive VIP Gift Boxes and handpicked festive combos now. 
                  Premium quality Sivakasi crackers with guaranteed safe delivery.
                </p>
              </FadeIn>

              <FadeIn delay={0.8} direction="right">
                <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                  <ScrollToProductsButton className="app-btn app-btn-primary px-16 py-7 text-sm">
                    Pre-Book Now
                  </ScrollToProductsButton>
                  <div className="flex items-center gap-4 text-muted font-black uppercase tracking-widest text-[10px]">
                    <Flame size={20} className="text-brand-gold animate-pulse" />
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
                    emoji: "🎆",
                    color: "text-brand-maroon",
                  },
                  {
                    title: "Family Box",
                    desc: "Fun for all ages",
                    emoji: "🎊",
                    color: "text-brand-carbon",
                  },
                  {
                    title: "Safety First",
                    desc: "100% Certified fireworks",
                    emoji: "🛡️",
                    color: "text-emerald-700",
                  },
                  {
                    title: "Fast Delivery",
                    desc: "Express shipping options",
                    emoji: "⚡",
                    color: "text-brand-gold",
                  },
                ].map((feature) => (
                  <FadeIn key={feature.title} delay={0.2} direction="left">
                    <div
                      className="bg-brand-cloud p-10 rounded-[3rem] border border-surface-border hover:shadow-2xl hover:shadow-brand-maroon/5 hover:-translate-y-2 transition-all group"
                    >
                      <div className="text-5xl mb-8 group-hover:rotate-12 transition-transform inline-block">
                        {feature.emoji}
                      </div>
                      <div className={`text-2xl font-black ${feature.color} mb-3 tracking-tightest uppercase`}>
                        {feature.title}
                      </div>
                      <div className="text-[10px] text-muted font-black uppercase tracking-widest leading-none">
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
