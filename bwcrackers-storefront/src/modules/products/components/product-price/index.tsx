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
      <div className="block w-32 h-9 bg-orange-100 animate-pulse rounded" />
    )
  }

  return (
    <div className="flex flex-col">
      <span
        className={clx("text-2xl font-bold", {
          "bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent":
            selectedPrice.price_type === "sale",
          "text-gray-900": selectedPrice.price_type !== "sale",
        })}
      >
        {!variant && "From "}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p className="text-gray-500 text-sm mt-2">
            <span>Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-green-600 font-bold text-sm mt-1">
            Save {selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
