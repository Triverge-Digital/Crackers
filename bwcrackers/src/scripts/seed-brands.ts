import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { BRAND_MODULE } from "../modules/brand"
import BrandModuleService from "../modules/brand/service"

// Seeds the known BW Crackers brands. Logo paths point to the storefront's
// public assets (served from the storefront origin). The 5 requested brands
// are enabled; the rest are seeded but disabled so they can be toggled on
// later from the admin.
const BRANDS = [
  { name: "Anil", handle: "anil", logo_url: "/brand1.png", is_enabled: true },
  { name: "Bheema", handle: "bheema", logo_url: "/brand2.png", is_enabled: true },
  { name: "Vanitha", handle: "vanitha", logo_url: "/brand3.png", is_enabled: true },
  { name: "Sony", handle: "sony", logo_url: "/brand4.png", is_enabled: true },
  { name: "Star Vell", handle: "star-vell", logo_url: "/brand8.png", is_enabled: true },
  { name: "Vadivel", handle: "vadivel", logo_url: "/brand5.png", is_enabled: false },
  { name: "Twitter Brand", handle: "twitter-brand", logo_url: "/brand6.png", is_enabled: false },
  { name: "Standard", handle: "standard", logo_url: "/brand7.png", is_enabled: false },
  { name: "We Two", handle: "we-two", logo_url: "/brand9.png", is_enabled: false },
]

export default async function seedBrands({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const brandService: BrandModuleService = container.resolve(BRAND_MODULE)

  const existing = await brandService.listBrands({})
  const existingHandles = new Set(existing.map((b: any) => b.handle))

  const toCreate = BRANDS.map((b, i) => ({ ...b, rank: i })).filter(
    (b) => !existingHandles.has(b.handle)
  )

  if (!toCreate.length) {
    logger.info("Brands already seeded — skipping.")
    return
  }

  await brandService.createBrands(toCreate)
  logger.info(`Seeded ${toCreate.length} brands.`)
}
