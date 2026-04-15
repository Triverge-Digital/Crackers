import { Metadata } from "next"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import AppHero from "@modules/home/components/app-hero"
import BentoShowcase from "@modules/home/components/bento-showcase"

// Lazy-load sections for the new App-Commerce layout
const FestivalBanner = dynamic(
  () => import("@modules/home/components/festival-banner").then(m => ({ default: m.FestivalBanner })),
  { fallback: <SectionSkeleton /> }
)

const ContactForm = dynamic(
  () => import("@modules/home/components/contact-form").then(m => ({ default: m.ContactForm })),
  { fallback: <SectionSkeleton /> }
)

function SectionSkeleton() {
  return (
    <div className="py-24 bg-brand-cloud">
      <div className="px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-brand-maroon/5 rounded-full w-48" />
          <div className="h-12 bg-brand-maroon/5 rounded-2xl w-full" />
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: "AHAMED | Premium Sivakasi Crackers",
  description:
    "The world's most premium artisanal fireworks experience. Direct from Sivakasi, delivered with joy.",
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
    <div className="min-h-screen">
      <AppHero />
      
      <div className="bg-white">
        <BentoShowcase />
      </div>

      <Suspense fallback={<SectionSkeleton />}>
        <FestivalBanner />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ContactForm />
      </Suspense>

      {/* Trust Badges Bar */}
      <section className="py-20 bg-brand-cloud border-t border-surface-border">
          <div className="px-6 md:px-12 max-w-[1440px] mx-auto flex flex-wrap justify-center md:justify-between items-center gap-12">
              {[
                  { label: "Safety First", sub: "100% Certified" },
                  { label: "Fast Shipping", sub: "Pan India Delivery" },
                  { label: "Direct Sivakasi", sub: "No Middlemen" },
                  { label: "Modern Pack", sub: "Vacuum Sealed" }
              ].map(badge => (
                  <div key={badge.label} className="flex flex-col items-center md:items-start">
                      <span className="text-display mb-1">{badge.label}</span>
                      <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{badge.sub}</span>
                  </div>
              ))}
          </div>
      </section>
    </div>
  )
}
