import { ScrollToProductsDiv } from "@modules/common/components/scroll-to-products"

export function PromoBanner() {
  return (
    <section className="py-24 bg-brand-soft-pink/30 relative overflow-hidden border-y border-brand-pink-500/5">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[400px] bg-brand-pink-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-brand-pink-50 px-6 py-2 rounded-full mb-6 border border-brand-pink-500/20">
            <span className="text-sm font-black text-brand-pink-500 uppercase tracking-widest">Exclusive Privileges</span>
          </div>
          <h2 className="text-h2 mb-4">
            Celebration <span className="text-brand-gradient italic">Specials</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
            Luxury experiences shouldn&apos;t have to wait. Explore our
            limited-time offers curated for the true connoisseur.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
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
              className="group relative transition-all duration-500 hover:-translate-y-2"
            >
              <div className="fancy-border-container p-10 bg-white relative overflow-hidden">
                <div className="fancy-border-accent"></div>
                
                {/* Card background accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-brand-${promo.theme === 'gold' ? 'gold-500' : 'pink-500'}/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>

                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                  {promo.icon}
                </div>
                <h3 className="text-3xl font-black text-brand-royal-950 mb-3 tracking-tighter group-hover:text-brand-pink-500 transition-colors uppercase">
                  {promo.title}
                </h3>
                <p className="text-text-muted text-lg mb-8 font-bold italic">
                  {promo.desc}
                </p>

                <div className="flex items-center gap-2 text-brand-pink-500 font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                  {promo.cta}
                  <div className="h-0.5 w-8 bg-brand-pink-500"></div>
                </div>
              </div>
            </ScrollToProductsDiv>
          ))}
        </div>
      </div>
    </section>
  )
}
