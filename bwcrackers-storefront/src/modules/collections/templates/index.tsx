import { Suspense } from "react"
import { Sparkles } from "lucide-react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 min-h-screen">
      {/* Background Glow Balls */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-400 px-6 py-3 rounded-full shadow-2xl border-2 border-white">
            <Sparkles className="h-5 w-5 text-purple-900" />
            <span className="text-sm font-bold text-purple-900">Collection</span>
          </div>

          <h1 className="text-5xl md:text-6xl text-white font-extrabold mt-6 drop-shadow-2xl">
            {collection.title}
          </h1>

          {collection.description && (
            <p className="text-white/90 max-w-2xl mx-auto mt-4 text-lg drop-shadow">
              {collection.description}
            </p>
          )}
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              Filters
            </h2>
            <RefinementList sortBy={sort} />
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={collection.products?.length}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                collectionId={collection.id}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
