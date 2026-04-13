import { Metadata } from "next"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { HeroSection } from "@modules/home/components/hero"
import { PromoBanner } from "@modules/home/components/promo-banner"
import { CelebrationSpecials } from "@modules/home/components/celebration-specials"
import { AnimatedStats } from "@modules/home/components/animated-stats"

// Lazy-load below-fold sections to reduce initial JS bundle
const FullWidthPromo = dynamic(
  () => import("@modules/home/components/promo-banner/full-width-promo").then(m => ({ default: m.FullWidthPromo })),
  { loading: () => <SectionSkeleton /> }
)
const FestivalBanner = dynamic(
  () => import("@modules/home/components/festival-banner").then(m => ({ default: m.FestivalBanner })),
  { loading: () => <SectionSkeleton /> }
)
const CategoryShowcase = dynamic(
  () => import("@modules/home/components/category-showcase").then(m => ({ default: m.CategoryShowcase })),
  { loading: () => <SectionSkeleton /> }
)
const ColorfulFeatures = dynamic(
  () => import("@modules/home/components/colorful-features").then(m => ({ default: m.ColorfulFeatures })),
  { loading: () => <SectionSkeleton /> }
)
const ImageGallery = dynamic(
  () => import("@modules/home/components/image-gallery").then(m => ({ default: m.ImageGallery })),
  { loading: () => <SectionSkeleton /> }
)
const CollectionsShowcase = dynamic(
  () => import("@modules/home/components/collections-showcase").then(m => ({ default: m.CollectionsShowcase })),
  { loading: () => <SectionSkeleton /> }
)
const ContactForm = dynamic(
  () => import("@modules/home/components/contact-form").then(m => ({ default: m.ContactForm })),
  { loading: () => <SectionSkeleton /> }
)

function SectionSkeleton() {
  return (
    <div className="py-24 celebration-bg">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/5 rounded-full w-48 mx-auto" />
          <div className="h-12 bg-white/5 rounded-lg w-96 mx-auto" />
          <div className="h-4 bg-white/5 rounded w-64 mx-auto" />
        </div>
      </div>
    </div>
  )
}

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
      <Suspense fallback={<SectionSkeleton />}>
        <CelebrationSpecials collections={collections} region={region} />
      </Suspense>
      <FullWidthPromo />
      <FestivalBanner />
      <CategoryShowcase />
      <ColorfulFeatures />
      <ImageGallery />
      <ContactForm />
      <CollectionsShowcase collections={collections} />
    </div>
  )
}
