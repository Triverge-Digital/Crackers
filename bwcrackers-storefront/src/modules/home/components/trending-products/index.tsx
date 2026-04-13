// modules/home/components/trending-products.tsx
import { Flame } from "lucide-react"
import FeaturedProducts from "../featured-products"
import { HttpTypes } from "@medusajs/types"

interface TrendingProductsProps {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}

export function TrendingProducts({ collections, region }: TrendingProductsProps) {
  return (
    <section className="py-24 celebration-bg relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-gold-400/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 glass-gold px-6 py-2 rounded-full mb-6 border border-brand-gold-400/20 shadow-glow-gold animate-sparkle">
            <Flame className="h-5 w-5 text-brand-gold-400 fill-brand-gold-400" />
            <span className="text-display text-brand-gold-200">The Season&apos;s Favorites</span>
          </div>
          <h2 className="text-h2 text-white mb-6">
            Trending <span className="text-gold">Firecrackers</span>
          </h2>
          <div className="h-1 w-24 bg-brand-gold-400 mx-auto rounded-full mb-6 opacity-30"></div>
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Discover the most sought-after collections that are lighting up 
            skies and creating memories across the nation.
          </p>
        </div>

        <FeaturedProducts collections={collections} region={region} />
      </div>
    </section>
  )
}