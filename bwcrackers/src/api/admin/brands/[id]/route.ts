import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BRAND_MODULE } from "../../../../modules/brand"
import BrandModuleService from "../../../../modules/brand/service"

// Admin: update a brand (name, logo, rank, enable/disable toggle).
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE)
  const id = req.params.id
  const body = req.body as {
    name?: string
    logo_url?: string | null
    handle?: string
    rank?: number
    is_enabled?: boolean
  }

  const update: Record<string, unknown> = { id }
  if (body.name !== undefined) update.name = body.name
  if (body.logo_url !== undefined) update.logo_url = body.logo_url
  if (body.handle !== undefined) update.handle = body.handle
  if (body.rank !== undefined) update.rank = body.rank
  if (body.is_enabled !== undefined) update.is_enabled = body.is_enabled

  const brand = await brandService.updateBrands(update)

  res.json({ brand })
}

// Admin: delete a brand.
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE)
  const id = req.params.id

  await brandService.deleteBrands(id)

  res.json({ id, object: "brand", deleted: true })
}
