import { Metadata } from "next"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { HeroSection } from "@modules/home/components/hero"
import { PromoBanner } from "@modules/home/components/promo-banner"
import { CelebrationSpecials } from "@modules/home/components/celebration-specials"
import { FullWidthPromo } from "@modules/home/components/promo-banner/full-width-promo"
import { AnimatedStats } from "@modules/home/components/animated-stats"
import { FestivalBanner } from "@modules/home/components/festival-banner"
import { CategoryShowcase } from "@modules/home/components/category-showcase"
import { ColorfulFeatures } from "@modules/home/components/colorful-features"
import { ImageGallery } from "@modules/home/components/image-gallery"
import { CollectionsShowcase } from "@modules/home/components/collections-showcase"
import { ContactForm } from "@modules/home/components/contact-form"

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
      <CelebrationSpecials collections={collections} region={region} />
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
