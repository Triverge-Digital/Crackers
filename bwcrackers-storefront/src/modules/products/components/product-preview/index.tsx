import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Star, ShoppingCart, Flame } from "lucide-react"
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
    product.categories?.[0]?.name || product.collection?.title || "Crackers"

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
    >
      <div
        data-testid="product-wrapper"
        className="bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col"
      >
        {/* Thumbnail with badges */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="small"
            isFeatured={isFeatured}
          />

          {/* Trending badge */}
          {isFeatured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <Flame className="h-3 w-3" />
              Trending
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View Details
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1">
          <div className="mb-2 flex-1">
            {/* Category badge */}
            <span className="inline-block text-xs border border-orange-300 text-orange-700 px-2 py-0.5 rounded-full mb-2">
              {category}
            </span>

            <Text
              className="font-semibold text-sm text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-orange-600 transition-colors mb-2"
              data-testid="product-title"
            >
              {product.title}
            </Text>

            {/* Star rating */}
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating
                      ? "fill-orange-400 text-orange-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">({rating}.0)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              {cheapestPrice && (
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  <PreviewPrice price={cheapestPrice} />
                </span>
              )}
            </div>
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:from-orange-600 hover:to-red-600 transition-colors">
              <ShoppingCart className="h-3 w-3" />
              Buy
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
