import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Sparkles } from "lucide-react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 min-h-screen" data-testid="category-container">
      {/* Background Glow Balls */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        {/* Header with Breadcrumb */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-400 px-6 py-3 rounded-full shadow-2xl border-2 border-white">
            <Sparkles className="h-5 w-5 text-purple-900" />
            <span className="text-sm font-bold text-purple-900">Category</span>
          </div>

          <h1 className="text-5xl md:text-6xl text-white font-extrabold mt-6 drop-shadow-2xl" data-testid="category-page-title">
            {category.name}
          </h1>

          {parents && parents.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4 text-white/90">
              {parents
                .slice()
                .reverse()
                .map((parent) => (
                  <LocalizedClientLink
                    key={parent.id}
                    className="hover:text-white transition"
                    href={`/categories/${parent.handle}`}
                    data-testid="sort-by-link"
                  >
                    {parent.name}
                  </LocalizedClientLink>
                ))}
            </div>
          )}

          {category.description && (
            <p className="text-white/90 max-w-2xl mx-auto mt-4 text-lg drop-shadow">
              {category.description}
            </p>
          )}
        </div>

        {/* Subcategories Grid (if any) */}
        {category.category_children && category.category_children.length > 0 && (
          <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {category.category_children?.map((c) => (
              <InteractiveLink 
                key={c.id} 
                href={`/categories/${c.handle}`}
                className="block"
              >
                <div className="card-gradient p-6 rounded-xl border border-[rgba(255,255,255,0.1)] hover:border-yellow-300/50 transition group">
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-300 transition">
                    {c.name}
                  </h3>
                </div>
              </InteractiveLink>
            ))}
          </div>
        )}

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              Filters
            </h2>
            <RefinementList sortBy={sort} data-testid="sort-by-container" />
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={category.products?.length ?? 8}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                categoryId={category.id}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
