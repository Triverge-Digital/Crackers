import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { HeroSection } from "@modules/home/components/hero"
import { PromoBanner } from "@modules/home/components/promo-banner"
import { TrendingProducts } from "@modules/home/components/trending-products"
import { FullWidthPromo } from "@modules/home/components/promo-banner/full-width-promo"
import { AnimatedStats } from "@modules/home/components/animated-stats"
import { FestivalBanner } from "@modules/home/components/festival-banner"
import { CategoryShowcase } from "@modules/home/components/category-showcase"
import { ColorfulFeatures } from "@modules/home/components/colorful-features"
import { ImageGallery } from "@modules/home/components/image-gallery"
import { CollectionsShowcase } from "@modules/home/components/collections-showcase"

export const metadata: Metadata = {
  title: "BW Crackers - Premium Firecrackers & Fireworks",
  description:
    "Experience the magic of festivals with our spectacular collection of premium fireworks and crackers. Quality guaranteed!",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id,handle,title",
  })

  if (!region) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <PromoBanner />
      <AnimatedStats />
      <TrendingProducts collections={collections} region={region} />
      <FullWidthPromo />
      <FestivalBanner />
      <CategoryShowcase />
      <ColorfulFeatures />
      <ImageGallery />
      <CollectionsShowcase collections={collections} />
      <div id="featured-products" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked selections from our best collections
            </p>
          </div>
          <FeaturedProducts collections={collections} region={region} />
        </div>
      </div>
    </div>
  )
}
