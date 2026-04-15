import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FadeIn, Float } from "@modules/common/components/animations"
import { Sparkles, ShoppingBag, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center overflow-hidden bg-brand-pink-500 border-b-8 border-brand-gold">
      {/* Intense Firework Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--brand-purple)_0%,_transparent_70%)]"></div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-10 p-10">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="text-4xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
              {i % 3 === 0 ? "🚀" : i % 3 === 1 ? "🎆" : "✨"}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Main Message */}
          <div className="text-center md:text-left flex-1 max-w-2xl">
            <FadeIn delay={0.2}>
              <div className="inline-flex items-center gap-3 bg-white px-6 py-2 rounded-full shadow-lg mb-8">
                <Sparkles className="h-5 w-5 text-brand-pink-500" />
                <span className="text-xs font-black text-brand-pink-500 uppercase tracking-[0.2em]">
                  Light Up Your Savings
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8 drop-shadow-lg">
                Grab <span className="text-brand-gold">80%</span> <br /> 
                <span className="italic">Instant Discount</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.6}>
              <p className="text-xl text-white/90 max-w-xl font-bold bg-brand-purple/20 backdrop-blur-sm p-4 rounded-xl border border-white/20 mb-10">
                Register now and get exclusive festival prices on our entire 2026 collection of Sivakasi Crackers!
              </p>
            </FadeIn>

            <FadeIn delay={0.8}>
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                <LocalizedClientLink
                  href="/pricelist"
                  className="bg-white text-brand-pink-500 font-black text-xl px-12 py-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-tighter"
                >
                  Order Now <ShoppingBag size={24} />
                </LocalizedClientLink>
              </div>
            </FadeIn>
          </div>

          {/* Side Graphic - Intense 80% Badge */}
          <div className="flex-shrink-0 relative hidden lg:block">
            <Float>
                <div className="ornate-container w-[450px] h-[450px] shadow-2xl">
                    <div className="text-center text-white z-10 flex flex-col items-center">
                        <div className="bg-white text-brand-pink-500 px-8 py-2 rounded-full font-black text-2xl mb-4 shadow-lg flex items-center gap-2">
                        <Zap className="fill-brand-pink-500" /> GET
                        </div>
                        <div className="text-9xl font-black italic tracking-tighter leading-none mb-2">80%</div>
                        <div className="text-5xl font-black uppercase tracking-tighter mb-4">DISCOUNT</div>
                        <div className="h-1 w-32 bg-brand-gold rounded-full mb-4"></div>
                        <div className="text-xl font-black uppercase tracking-widest text-brand-gold">On All Crackers</div>
                    </div>
                </div>
            </Float>
            
            {/* Extra sparks */}
            <div className="absolute top-0 right-0 animate-ping h-8 w-8 bg-brand-gold rounded-full opacity-50"></div>
            <div className="absolute bottom-10 -left-10 animate-bounce h-12 w-12 text-5xl">🎇</div>
          </div>
        </div>
      </div>
    </section>
  )
}
