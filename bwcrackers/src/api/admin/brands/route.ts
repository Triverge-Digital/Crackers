import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BRAND_MODULE } from "../../../modules/brand"
import BrandModuleService from "../../../modules/brand/service"

// Admin: list ALL brands (enabled + disabled), ordered by rank.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE)

  const brands = await brandService.listBrands(
    {},
    { order: { rank: "ASC" } }
  )

  res.json({ brands })
}

// Admin: create a new brand.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE)
  const body = req.body as {
    name: string
    logo_url?: string
    handle?: string
    rank?: number
    is_enabled?: boolean
  }

  const handle =
    body.handle ||
    (body.name || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const brand = await brandService.createBrands({
    name: body.name,
    handle,
    logo_url: body.logo_url ?? null,
    rank: body.rank ?? 0,
    is_enabled: body.is_enabled ?? true,
  })

  res.json({ brand })
}
