import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="celebration-bg min-h-screen relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[400px] bg-brand-gold-400/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-brand-accent-hot/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="content-container py-16 lg:py-24 relative z-10" data-testid="product-container">
        <div className="grid grid-cols-1 small:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start">
          <div className="w-full space-y-12">
            <div className="glass-card p-6 rounded-[2.5rem] border border-white/5 overflow-hidden">
               <ImageGallery images={images} />
            </div>
            <div className="glass-card p-8 rounded-[2rem] border border-white/5">
              <ProductTabs product={product} />
            </div>
          </div>

          <aside className="w-full small:sticky small:top-32">
            <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 flex flex-col gap-y-10 shadow-glow-gold/10 relative overflow-hidden">
               {/* Subtle background accent */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               
              <ProductInfo product={product} />
              <ProductOnboardingCta />
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>

      <div className="content-container my-24 border-t border-white/5 pt-24" data-testid="related-products-container">
        <div className="mb-12">
          <h2 className="text-display text-brand-gold-400 uppercase tracking-[0.4em] mb-4">Elite Suggestions</h2>
          <h3 className="text-4xl font-black text-white font-serif">You May Also <span className="text-gold italic">Desire</span></h3>
        </div>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
