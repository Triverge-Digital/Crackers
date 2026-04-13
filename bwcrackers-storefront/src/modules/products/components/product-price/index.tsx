import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return (
      <div className="block w-32 h-9 bg-brand-royal-900/50 animate-pulse rounded-lg border border-white/5" />
    )
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-end gap-x-2">
         <span className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1.5 font-sans">
          {!variant ? "Starting at" : "Investment"}
        </span>
        <span
          className={clx("text-4xl font-black font-serif tracking-tighter", {
            "text-gold shadow-glow-gold": selectedPrice.price_type === "sale",
            "text-white": selectedPrice.price_type !== "sale",
          })}
        >
          <span
            data-testid="product-price"
            data-value={selectedPrice.calculated_price_number}
          >
            {selectedPrice.calculated_price}
          </span>
        </span>
      </div>

      {selectedPrice.price_type === "sale" && (
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2">
            <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">Original</span>
            <span
              className="line-through text-white/30 text-sm font-medium"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </div>
          <div className="glass-gold px-3 py-1 rounded-full border border-brand-gold-400/20 shadow-glow-gold">
            <span className="text-[10px] font-black text-brand-gold-400 uppercase tracking-widest whitespace-nowrap">
              Save {selectedPrice.percentage_diff}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
