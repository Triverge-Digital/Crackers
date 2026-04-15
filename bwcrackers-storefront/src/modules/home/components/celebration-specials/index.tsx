import { Sparkles, Star } from "lucide-react"
import FeaturedProducts from "../featured-products"
import { HttpTypes } from "@medusajs/types"
import { FadeIn } from "@modules/common/components/animations"

interface CelebrationSpecialsProps {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}

export function CelebrationSpecials({ collections, region }: CelebrationSpecialsProps) {
  return (
    <section className="py-32 bg-white relative overflow-hidden border-y border-brand-pink-500/5">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-full h-full bg-brand-pink-500/5 blur-[120px] pointer-events-none -z-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <FadeIn delay={0.2}>
            <div className="inline-flex items-center gap-3 bg-brand-pink-50 px-8 py-3 rounded-full mb-8 border border-brand-pink-500/20 shadow-sm">
              <Sparkles className="h-5 w-5 text-brand-pink-500" />
              <span className="text-sm font-black text-brand-pink-500 uppercase tracking-[0.2em]">Seasonal Picks</span>
              <Sparkles className="h-5 w-5 text-brand-pink-500" />
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <h2 className="text-h2 mb-4">
              Celebration <span className="text-brand-gradient italic underline decoration-brand-gold-500 decoration-4 underline-offset-8">Specials</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-brand-pink-500/20"></div>
              <Star className="text-brand-gold-500 h-4 w-4 fill-brand-gold-500" />
              <div className="h-px w-16 bg-brand-pink-500/20"></div>
            </div>
          </FadeIn>

          <FadeIn delay={0.8}>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
              Witness the magic of our most prestigious collections.
              Handpicked to make your festivals truly majestic.
            </p>
          </FadeIn>
        </div>

        {/* Product Showcase */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-brand-pink-500/5 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>

          <FeaturedProducts collections={collections} region={region} />
        </div>

        {/* VIP Callout */}
        <FadeIn delay={1.2}>
          <div className="mt-20 text-center">
             <div className="fancy-border-container inline-flex items-center gap-6 px-10 py-5 bg-white relative">
                <div className="fancy-border-accent"></div>
                <span className="text-text-muted text-xs font-black uppercase tracking-widest">Limited Availability</span>
                <div className="w-px h-4 bg-brand-pink-500/20"></div>
                <span className="text-brand-pink-500 font-bold italic tracking-tight">80% Discount applied to all Specials</span>
             </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
