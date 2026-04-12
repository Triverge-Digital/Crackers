// modules/products/components/product-preview/price.tsx
import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return (
      <Text className="text-gray-500 text-sm" data-testid="price">
        Coming Soon
      </Text>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {price.price_type === "sale" && (
        <Text
          className="line-through text-gray-400 text-xs"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
      <Text
        className={clx("font-bold text-lg", {
          "text-green-600": price.price_type === "sale",
          "text-orange-600": price.price_type !== "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
    </div>
  )
}