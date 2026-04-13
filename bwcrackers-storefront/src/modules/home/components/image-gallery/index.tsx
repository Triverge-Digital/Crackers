import { FadeIn } from "@modules/common/components/animations"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const images = [
  {
    url: "/images/products/bw-157-sunrises-22-items.jpeg",
    title: "Majestic Display",
    category: "Combo Offer",
    price: "₹3,000",
    items: "44 Items"
  },
  {
    url: "/images/products/bw-159-mumbai-indians-31-items.jpeg",
    title: "Celestial Selection",
    category: "Gift Box",
    price: "₹5,000",
    items: "50 Items"
  },
  {
    url: "/images/products/bw-161-andal-nachiyar-51-items.jpeg",
    title: "Royal Grandeur",
    category: "Imperial Pack",
    price: "₹5,000",
    items: "50 Items"
  },
]

export function ImageGallery() {
  return (
    <section className="py-24 celebration-bg relative overflow-hidden border-t border-white/5">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-gold-400/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <FadeIn delay={0.2} direction="down">
            <div className="inline-flex items-center gap-3 glass-gold px-6 py-2 rounded-full mb-8 border border-brand-gold-400/20 shadow-glow-gold">
              <span className="text-display text-brand-gold-200 tracking-[0.2em]">Visual Splendor</span>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <h2 className="text-h1 text-white mb-6">
              Magical <span className="text-gold italic">Moments</span>
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <p className="text-2xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
              Capture the essence of celebrations with our spectacular fireworks, 
              crafted to illuminate your most precious memories.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-10 lg:gap-14 max-w-7xl mx-auto">
          {images.map((image, index) => (
            <FadeIn key={index} delay={0.2 * index} direction="up">
              <LocalizedClientLink
                href="/store"
                className="group block relative"
              >
                 {/* Card Container */}
                <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/10 group-hover:border-brand-gold-400/40 transition-all duration-700 shadow-2xl relative">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0"
                    />
                    {/* Golden Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-royal-950 via-brand-royal-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700"></div>
                    
                    {/* Top Badge */}
                    <div className="absolute top-6 left-6 glass-gold px-4 py-1.5 rounded-full border border-brand-gold-400/20 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold-400 shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      {image.category}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-10 relative">
                    <div className="flex justify-between items-end mb-4">
                      <div className="flex flex-col gap-y-1">
                        <span className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em]">{image.items}</span>
                        <h3 className="text-2xl font-black text-white font-serif tracking-tight group-hover:text-gold transition-colors duration-500 leading-tight">
                          {image.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-gold font-black text-2xl tracking-tighter block">{image.price}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-brand-gold-400 font-bold uppercase tracking-widest text-[10px] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      View Exclusive Offer
                      <div className="h-px flex-1 bg-brand-gold-400/20"></div>
                    </div>
                  </div>
                </div>

                {/* Decorative glow behind card */}
                <div className="absolute inset-0 bg-brand-gold-400/5 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
              </LocalizedClientLink>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
