"use client"

import React, { Suspense } from "react"
import { Sparkles, ArrowLeft, Heart, Share2, ShieldCheck, Zap } from "lucide-react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

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
    <div className="bg-brand-cloud min-h-screen relative overflow-hidden">
      {/* Cinematic noise and glow */}
      <div className="bg-noise absolute inset-0 pointer-events-none opacity-5"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-40 blur-[150px] -z-10"></div>
      
      <div className="px-6 md:px-12 py-12 relative z-10 max-w-[1440px] mx-auto" data-testid="product-container">
        {/* Navigation Bar */}
        <div className="mb-12 flex items-center justify-between">
            <LocalizedClientLink href="/store" className="flex items-center gap-4 text-brand-carbon font-black text-[10px] uppercase tracking-[0.4em] hover:text-brand-maroon transition-all group">
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
                Back to Discovery
            </LocalizedClientLink>
            <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full bg-white shadow-sm hover:shadow-xl transition-all flex items-center justify-center text-muted hover:text-brand-maroon border border-surface-border">
                    <Heart size={20} />
                </button>
                <button className="w-12 h-12 rounded-full bg-white shadow-sm hover:shadow-xl transition-all flex items-center justify-center text-muted hover:text-brand-carbon border border-surface-border">
                    <Share2 size={20} />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-[1fr_500px] gap-12 lg:gap-24 items-start">
          <div className="w-full space-y-20">
            <div className="bg-white p-6 rounded-[4rem] shadow-2xl shadow-brand-maroon/5 border border-surface-border overflow-hidden">
               <ImageGallery images={images} />
            </div>
            
            <div className="bento-card p-12 bg-white">
               <div className="flex items-center gap-4 mb-10 pb-6 border-b border-surface-border">
                  <Zap size={20} className="text-brand-maroon" />
                  <h3 className="text-[10px] font-black text-brand-maroon uppercase tracking-[0.3em]">Full Specifications</h3>
               </div>
               <ProductTabs product={product} />
            </div>
          </div>

          <aside className="w-full small:sticky small:top-32">
            <div className="bento-card p-12 bg-white flex flex-col gap-y-12 relative overflow-hidden shadow-2xl shadow-brand-maroon/10">
               <div className="bg-noise absolute inset-0 pointer-events-none opacity-[0.03]"></div>
               
               {/* Premium Tag */}
               <div className="absolute top-0 right-0 py-3 px-8 bg-brand-maroon text-white font-black text-[9px] uppercase tracking-[0.4em] rounded-bl-[2rem] shadow-lg">
                   PREMIUM ELITE
               </div>
               
              <ProductInfo product={product} />
              
              <div className="bg-brand-cloud p-8 rounded-3xl border border-surface-border flex items-center gap-6">
                 <div className="w-14 h-14 rounded-full bg-white border border-surface-border flex items-center justify-center text-brand-maroon">
                    <ShieldCheck size={24} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs font-black text-brand-carbon uppercase tracking-widest">Safety Verified</span>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mt-1">Sivakasi Quality Control</span>
                 </div>
              </div>

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

              <div className="pt-8 border-t border-surface-border">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="h-10 w-10 rounded-full bg-brand-cloud border-2 border-white overflow-hidden shadow-sm">
                               <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <span className="text-[9px] font-black text-carbon uppercase tracking-[0.2em] leading-none opacity-60">
                        Join 200+ shoppers viewing this
                    </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="my-32 max-w-[1440px] mx-auto px-6 md:px-12" data-testid="related-products-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-brand-gold" />
                  <span className="text-[10px] font-black text-brand-maroon uppercase tracking-[0.4em]">Recommended for you</span>
              </div>
              <h2 className="text-h2 text-brand-carbon leading-[0.9] uppercase">
                  COMPLETE YOUR <br />
                  <span className="text-brand-maroon italic">CELEBRATION</span>
              </h2>
          </div>
          <LocalizedClientLink href="/store" className="app-btn app-btn-secondary px-12">
              Browse Full Catalog
          </LocalizedClientLink>
        </div>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
