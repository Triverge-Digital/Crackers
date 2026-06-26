import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BRAND_MODULE } from "../../../modules/brand"
import BrandModuleService from "../../../modules/brand/service"

// Public storefront endpoint: returns only enabled brands, ordered by rank.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE)

  const brands = await brandService.listBrands(
    { is_enabled: true },
    { order: { rank: "ASC" } }
  )

  res.json({ brands })
}
