"use client"

import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getProductPrice } from "@lib/util/get-product-price"
import { ShoppingCart, ArrowRight } from "lucide-react"

export default function ProductPreview({
  product,
  region,
  isFeatured,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  isFeatured?: boolean
}) {
  const { cheapestPrice } = getProductPrice({
    product,
    region,
  })

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group"
    >
      <div className="bento-card p-4 h-full flex flex-col items-start bg-white group-hover:-translate-y-2 transition-all duration-700">
        {/* Badge & Image Container */}
        <div className="relative w-full aspect-[4/5] rounded-[1.8rem] overflow-hidden bg-brand-cloud mb-6">
            <Thumbnail
                thumbnail={product.thumbnail}
                images={product.images}
                size="full"
                isFeatured={isFeatured}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {cheapestPrice?.percentage_diff && (
                <div className="absolute top-4 left-4 bg-brand-maroon text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg z-10 uppercase tracking-widest">
                    {cheapestPrice.percentage_diff}% OFF
                </div>
            )}
            
            <div className="absolute inset-x-4 bottom-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 z-10">
                <div className="app-btn app-btn-primary w-full py-3 rounded-2xl">
                    <span className="text-[10px]">View Details</span>
                    <ArrowRight size={14} />
                </div>
            </div>
            
            <div className="absolute inset-0 bg-brand-maroon/0 group-hover:bg-brand-maroon/5 transition-colors duration-700"></div>
        </div>

        {/* Info */}
        <div className="flex flex-col w-full px-2">
            <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-sm font-black text-brand-carbon uppercase tracking-tight leading-snug group-hover:text-brand-maroon transition-colors line-clamp-2">
                    {product.title}
                </h3>
                <div className="h-2 w-2 rounded-full bg-brand-gold mt-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-border">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-muted uppercase tracking-widest leading-none mb-1">Price Starts At</span>
                    {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
                </div>
                
                <div className="w-10 h-10 rounded-full border border-surface-border flex items-center justify-center text-muted group-hover:border-brand-maroon group-hover:text-brand-maroon transition-all">
                    <ShoppingCart size={16} />
                </div>
            </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
