import { ScrollToProductsDiv } from "@modules/common/components/scroll-to-products"

export function PromoBanner() {
  return (
    <section className="py-24 celebration-bg relative overflow-hidden border-y border-white/5">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[400px] bg-brand-accent-hot/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 glass-gold px-6 py-2 rounded-full mb-6 border border-brand-gold-400/20">
            <span className="text-display text-brand-gold-200 tracking-[0.2em]">Exclusive Privileges</span>
          </div>
          <h2 className="text-h2 text-white mb-6">
            Celebration <span className="text-gold italic">Specials</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-light">
            Luxury experiences shouldn&apos;t have to wait. Explore our
            limited-time offers curated for the true connoisseur.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Complimentary Delivery",
              desc: "On all orders above ₹3,000",
              icon: "🚚",
              cta: "Check Eligibility",
              theme: "gold",
            },
            {
              title: "Early Bird Reward",
              desc: "Flat 80% Discount Applied",
              icon: "💎",
              cta: "Shop The Collection",
              theme: "pink",
            },
          ].map((promo) => (
            <ScrollToProductsDiv
              key={promo.title}
              className="glass-card p-10 rounded-[2.5rem] border border-white/5 hover:border-brand-gold-400/30 transition-all duration-500 cursor-pointer group relative overflow-hidden"
            >
              {/* Card background accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-brand-${promo.theme === 'gold' ? 'gold-400' : 'accent-hot'}/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>

              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                {promo.icon}
              </div>
              <h3 className="text-3xl font-black text-white mb-3 tracking-tight group-hover:text-gold transition-colors">
                {promo.title}
              </h3>
              <p className="text-white/60 text-lg mb-8 font-light">
                {promo.desc}
              </p>

              <div className="flex items-center gap-2 text-brand-gold-400 font-bold uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                {promo.cta}
                <div className="h-px w-8 bg-brand-gold-400"></div>
              </div>
            </ScrollToProductsDiv>
          ))}
        </div>
      </div>
    </section>
  )
}
