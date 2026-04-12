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
    <section className="py-16 bg-gradient-to-br from-green-400 via-teal-400 to-blue-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/10"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-full mb-4 shadow-lg border-2 border-white">
            <Flame className="h-5 w-5 text-white fill-white" />
            <span className="text-sm font-semibold text-white">🔥 Hot Picks 🔥</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-white font-bold mb-4 drop-shadow-lg">
            Trending Products
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Check out our most popular firecrackers that are lighting up celebrations everywhere
          </p>
        </div>

        <FeaturedProducts collections={collections} region={region} />
      </div>
    </section>
  )
}