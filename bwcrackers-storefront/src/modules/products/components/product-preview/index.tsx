import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Star, ShoppingCart, Flame, Sparkles } from "lucide-react"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const rating = 4 + Math.floor(Math.random() * 2) // 4 or 5 stars
  const category =
    product.categories?.[0]?.name || product.collection?.title || "Premium"

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
    >
      <div
        data-testid="product-wrapper"
        className="glass-card rounded-2xl border border-white/5 hover:border-brand-gold-400/50 hover:shadow-glow-gold transition-all duration-500 overflow-hidden h-full flex flex-col group/card"
      >
        {/* Thumbnail with celebration overlay */}
        <div className="relative overflow-hidden bg-brand-royal-900/50 aspect-[4/5] sm:aspect-square">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="group-hover/card:scale-110 transition-transform duration-700 object-cover"
          />

          {/* Premium Badge */}
          {isFeatured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-brand-gold-500 to-brand-accent-orange text-brand-royal-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-premium flex items-center gap-1.5 animate-pulse">
              <Flame className="h-3 w-3 fill-current" />
              Hot Pick
            </div>
          )}

          {/* Hover overlay with glassmorphism */}
          <div className="absolute inset-0 bg-brand-royal-950/40 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6 text-center">
            <div className="border border-brand-gold-400/30 p-4 rounded-xl transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500">
               <span className="text-gold font-bold text-sm uppercase tracking-widest block mb-2">
                 Quick View
               </span>
               <div className="h-0.5 w-12 bg-brand-gold-400 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Product Info with Premium Styling */}
        <div className="p-5 flex flex-col flex-1 relative overflow-hidden">
           {/* Subtle background glow */}
           <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold-400/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 decoration-clone"></div>
           
          <div className="mb-3 flex-1">
            {/* Elegant Category tag */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black text-brand-gold-400 uppercase tracking-[0.2em]">
                {category}
              </span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <Text
              className="font-serif text-lg text-white group-hover/card:text-brand-gold-200 transition-colors line-clamp-2 leading-snug mb-3 tracking-tight"
              data-testid="product-title"
            >
              {product.title}
            </Text>

            {/* Star rating - Minimalist gold */}
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < rating
                      ? "fill-brand-gold-400 text-brand-gold-400"
                      : "text-white/20"
                  }`}
                />
              ))}
              <span className="text-[10px] text-white/40 font-bold ml-2 uppercase tracking-widest">
                Safe & Quality
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 uppercase font-black tracking-widest mb-0.5">Starting from</span>
              {cheapestPrice && (
                <div className="text-2xl font-black text-gold tracking-tighter">
                  <PreviewPrice price={cheapestPrice} />
                </div>
              )}
            </div>
            <button className="h-10 w-10 rounded-full bg-brand-gold-400 hover:bg-white text-brand-royal-950 flex items-center justify-center transition-all shadow-glow-gold hover:scale-110 active:scale-95 group/btn">
              <ShoppingCart className="h-5 w-5 transform group-hover/btn:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
