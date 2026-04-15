import { Suspense } from "react"
import { Sparkles, Filter, Grid, SlidersHorizontal } from "lucide-react"

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
    <div className="bg-brand-cloud min-h-screen relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-white opacity-50 blur-3xl -z-10"></div>
      
      <div className="px-6 md:px-12 pt-32 pb-24 relative z-10 max-w-[1440px] mx-auto">
        {/* App Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-3 bg-white border border-surface-border px-6 py-2 rounded-full mb-8 shadow-sm">
              <Sparkles className="h-4 w-4 text-brand-gold" />
              <span className="text-[10px] font-black text-brand-maroon uppercase tracking-[0.4em]">Product Discovery</span>
            </div>
            <h1 className="text-h2 text-brand-carbon leading-none uppercase">
                EXPLORE <span className="text-brand-maroon italic">BRILLIANCE</span>
            </h1>
          </div>
          <p className="text-sm font-bold text-secondary max-w-sm leading-relaxed mb-1">
            Discover Sivakasi&apos;s finest artisanal firecrackers. 
            Engineered for safety, designed for awe.
          </p>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-[320px_1fr] gap-12 lg:gap-20 items-start">
          {/* Sidebar / Filter Utility */}
          <aside className="w-full lg:sticky lg:top-32">
            <div className="bento-card p-10 bg-white relative overflow-hidden">
                <div className="bg-noise absolute inset-0 pointer-events-none opacity-5"></div>
                
              <div className="flex items-center gap-3 mb-10 pb-6 border-b border-surface-border">
                <SlidersHorizontal size={18} className="text-brand-maroon" />
                <h3 className="text-[10px] font-black text-brand-maroon uppercase tracking-[0.2em]">
                  Refine Selection
                </h3>
              </div>
              <RefinementList sortBy={sort} />
            </div>
          </aside>

          {/* Product Grid Container */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <Grid size={18} className="text-brand-maroon" />
                    <span className="text-[10px] font-black text-brand-carbon uppercase tracking-[0.2em]">Catalog Grid</span>
                </div>
                <div className="h-px flex-1 mx-10 bg-surface-border rounded-full hidden md:block"></div>
                <div className="text-[10px] font-black text-muted uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-surface-border shadow-sm">
                    Latest Collection
                </div>
            </div>

            <div className="min-h-[50vh]">
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
  )
}

export default StoreTemplate
