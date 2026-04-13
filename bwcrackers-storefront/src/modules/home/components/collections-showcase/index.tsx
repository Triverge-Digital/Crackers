import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const defaultCollections = [
  {
    name: "Sparklers & Ground Chakkars",
    description: "Perfect for kids and family fun",
    image: "/images/products/bw-1-2-3-4-kuruvi.jpeg",
    itemCount: 45,
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "Aerial Fireworks",
    description: "Spectacular sky shows",
    image: "/images/products/bw-17-baby-rocket.jpeg",
    itemCount: 67,
    color: "from-blue-500 to-purple-500",
  },
  {
    name: "Festival Combo Packs",
    description: "Complete celebration bundles",
    image: "/images/products/bw-157-sunrises-22-items.jpeg",
    itemCount: 32,
    color: "from-pink-500 to-red-500",
  },
  {
    name: "Sound Crackers",
    description: "Loud and exciting celebrations",
    image: "/images/products/bw-7-2-sound-crackers.jpeg",
    itemCount: 58,
    color: "from-red-500 to-orange-500",
  },
]

export function CollectionsShowcase({
  collections,
}: {
  collections?: HttpTypes.StoreCollection[]
}) {
  return (
    <section className="py-24 celebration-bg relative overflow-hidden border-t border-white/5">
      {/* Background accents */}
      <div className="absolute bottom-0 left-0 w-full h-[400px] bg-brand-royal-700/5 blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 glass-gold px-6 py-2 rounded-full mb-6 border border-brand-gold-400/20 shadow-glow-gold animate-sparkle">
            <Sparkles className="h-5 w-5 text-brand-gold-400 fill-brand-gold-400" />
            <span className="text-display text-brand-gold-200">Curated Galleries</span>
          </div>
          <h2 className="text-h2 text-white mb-6">
            Bespoke <span className="text-gold italic">Collections</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
            From majestic aerial displays to intimate family festivities, 
            explore our world-class crackers by theme and occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {defaultCollections.map((collection, index) => (
            <LocalizedClientLink
              key={index}
              href="/store"
              className="group glass-card rounded-[2rem] overflow-hidden border border-white/5 hover:border-brand-gold-400/30 transition-all duration-500 cursor-pointer animate-fade-in-top"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-royal-950 via-brand-royal-950/20 to-transparent"></div>
                
                <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-gold transition-colors font-serif">
                    {collection.name}
                  </h3>
                  <p className="text-white/50 text-sm mb-6 font-light line-clamp-2">
                    {collection.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                      {collection.itemCount} Varieties
                    </span>
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-brand-gold-400 text-brand-royal-950 shadow-glow-gold hover:scale-110 transition-transform">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
