"use client"

import { Sparkles, Star } from "lucide-react"
import { Fireworks } from "@modules/common/components/fireworks"
import FeaturedProducts from "../featured-products"
import { HttpTypes } from "@medusajs/types"
import { FadeIn } from "@modules/common/components/animations"

interface CelebrationSpecialsProps {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}

export function CelebrationSpecials({ collections, region }: CelebrationSpecialsProps) {
  return (
    <section className="py-32 celebration-bg relative overflow-hidden border-y border-white/5">
      {/* Dynamic Fireworks Background - Isolated to this section */}
      {/* Atmospheric overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-royal-950 via-transparent to-brand-royal-950 opacity-60 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)] z-0"></div>

      {/* Dynamic Fireworks Background - Isolated to this section */}
      <div className="absolute inset-0 z-[1]">
        <Fireworks />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <FadeIn delay={0.2}>
            <div className="inline-flex items-center gap-3 glass-gold px-8 py-3 rounded-full mb-8 border border-brand-gold-400/30 shadow-glow-gold animate-sparkle">
              <Sparkles className="h-5 w-5 text-brand-gold-400" />
              <span className="text-display text-brand-gold-200 tracking-[0.3em]">Exclusive Seasonal Picks</span>
              <Sparkles className="h-5 w-5 text-brand-gold-400" />
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <h2 className="text-h1 text-white mb-6">
              Celebration <span className="text-gold italic">Specials</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-brand-gold-400/50"></div>
              <Star className="text-brand-gold-400 h-4 w-4 fill-brand-gold-400" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-brand-gold-400/50"></div>
            </div>
          </FadeIn>

          <FadeIn delay={0.8}>
            <p className="text-2xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
              Witness the magic of our most prestigious collections. 
              Handpicked to make your festivals truly majestic.
            </p>
          </FadeIn>
        </div>

        {/* Product Showcase */}
        <div className="relative group">
          {/* Subtle glow behind products */}
          <div className="absolute -inset-4 bg-brand-gold-400/5 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>
          
          <FeaturedProducts collections={collections} region={region} />
        </div>
        
        {/* VIP Callout */}
        <FadeIn delay={1.2}>
          <div className="mt-20 text-center">
             <div className="glass-card inline-flex items-center gap-6 px-10 py-5 rounded-full border border-white/10 hover:border-brand-gold-400/30 transition-all duration-500">
                <span className="text-white/40 text-xs font-black uppercase tracking-widest">Limited Availability</span>
                <div className="w-px h-4 bg-white/10"></div>
                <span className="text-gold font-bold italic">80% Discount applied to all Specials</span>
             </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
