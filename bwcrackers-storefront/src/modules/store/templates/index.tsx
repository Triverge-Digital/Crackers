import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="celebration-bg min-h-screen relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[400px] bg-brand-gold-400/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-4 pt-44 pb-24 relative z-10">
        {/* Cinematic Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 glass-gold px-6 py-2 rounded-full mb-8 border border-brand-gold-400/20 shadow-glow-gold animate-sparkle">
            <span className="text-display text-brand-gold-200 tracking-[0.2em]">The Grand Catalog</span>
          </div>
          <h1 className="text-h1 text-white mb-8">
            Explore <span className="text-gold italic">Pure Magic</span>
          </h1>
          <div className="h-1 w-24 bg-brand-gold-400 mx-auto rounded-full mb-8 opacity-30"></div>
          <p className="text-2xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
            Discover a legacy of quality and a future of brilliance. Our 
            entire collection of artisanal firecrackers, curated for your 
            most precious moments.
          </p>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-start">
          {/*sidebar */}
          <aside className="w-full lg:sticky lg:top-52 group">
            <div className="glass-card p-8 rounded-[2rem] border border-white/10 shadow-glow-gold/5 relative overflow-hidden transition-all duration-500 hover:border-brand-gold-400/30">
               <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold-400/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
               
              <h3 className="text-[10px] font-black text-brand-gold-400 uppercase tracking-[0.3em] mb-10">
                Refine Selection
              </h3>
              <RefinementList sortBy={sort} />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <div className="glass-card p-1 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-sm">
               <div className="p-8">
                <Suspense fallback={<SkeletonProductGrid />}>
                  <PaginatedProducts
                    sortBy={sort}
                    page={pageNumber}
                    countryCode={countryCode}
                  />
                </Suspense>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
