import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  updateProductsWorkflow,
  updateProductVariantsWorkflow,
} from "@medusajs/medusa/core-flows"
import { PRICELIST_2026 } from "./data/pricelist-2026"
import { SKU_PREFIX, CURRENCY_CODE } from "../lib/pricing"

/**
 * Makes the Medusa catalog match the storefront's 2026 price list, keyed by SKU
 * `BW-<code>`: updates title, category and INR price of existing variants, creates
 * missing products, and unpublishes (never deletes) products not on the list.
 *
 *   DRY_RUN=1 npx medusa exec ./src/scripts/sync-pricelist.ts   # report only
 *   npx medusa exec ./src/scripts/sync-pricelist.ts             # apply
 */
export default async function syncPricelist({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const dryRun = !!process.env.DRY_RUN && process.env.DRY_RUN !== "0"
  const say = (msg: string) => logger.info(`[sync-pricelist]${dryRun ? " [dry run]" : ""} ${msg}`)

  // --- Categories -----------------------------------------------------------
  const { data: existingCats } = await query.graph({ entity: "product_category", fields: ["id", "name"] })
  const catId = new Map<string, string>((existingCats as any[]).map((c) => [c.name.toLowerCase(), c.id]))
  const neededCats = [...new Set(PRICELIST_2026.map((p) => p.category))]
  const missingCats = neededCats.filter((name) => !catId.has(name.toLowerCase()))
  if (missingCats.length) {
    say(`creating ${missingCats.length} categories: ${missingCats.join(", ")}`)
    if (!dryRun) {
      const { result } = await createProductCategoriesWorkflow(container).run({
        input: { product_categories: missingCats.map((name) => ({ name, is_active: true })) },
      })
      for (const c of result) catId.set(c.name.toLowerCase(), c.id)
    }
  }

  // --- Existing catalog -----------------------------------------------------
  const { data: variants } = await query.graph({
    entity: "variant",
    fields: ["id", "sku", "title", "product.id", "product.title", "product.status", "prices.amount", "prices.currency_code"],
  })
  const bySku = new Map<string, any>()
  for (const v of variants as any[]) if (v.sku) bySku.set(String(v.sku).toUpperCase(), v)

  const wanted = new Map(PRICELIST_2026.map((p) => [`${SKU_PREFIX}${p.code}`.toUpperCase(), p]))
  const toCreate = PRICELIST_2026.filter((p) => !bySku.has(`${SKU_PREFIX}${p.code}`.toUpperCase()))
  const productUpdates: any[] = []
  const variantUpdates: any[] = []

  for (const [sku, item] of wanted) {
    const v = bySku.get(sku)
    if (!v) continue
    const price = (v.prices ?? []).find((p: any) => p.currency_code === CURRENCY_CODE)?.amount
    const changes: string[] = []
    if (v.product?.title !== item.title) changes.push(`title "${v.product?.title}" → "${item.title}"`)
    if (price !== item.price) changes.push(`price ₹${price ?? "none"} → ₹${item.price}`)
    if (v.product?.status !== ProductStatus.PUBLISHED) changes.push("publish")
    if (changes.length) say(`${sku}: ${changes.join(", ")}`)

    productUpdates.push({
      id: v.product.id,
      title: item.title,
      status: ProductStatus.PUBLISHED,
      category_ids: [catId.get(item.category.toLowerCase())].filter(Boolean),
      description: `${item.title} - ${item.category}. MRP ₹${item.mrp}, 80% discount price ₹${item.price}. Sold as ${item.unit}.`,
    })
    variantUpdates.push({ id: v.id, title: item.unit, prices: [{ amount: item.price, currency_code: CURRENCY_CODE }] })
  }

  // Products whose SKU is not on the price list (or that have no SKU) are hidden, not deleted.
  const { data: allProducts } = await query.graph({ entity: "product", fields: ["id", "title", "status", "variants.sku"] })
  const toUnpublish = (allProducts as any[]).filter(
    (p) =>
      p.status === ProductStatus.PUBLISHED &&
      !(p.variants ?? []).some((v: any) => v.sku && wanted.has(String(v.sku).toUpperCase()))
  )
  for (const p of toUnpublish) say(`unpublish "${p.title}" (not on the 2026 price list)`)

  say(`${productUpdates.length} existing products checked, ${toCreate.length} to create, ${toUnpublish.length} to unpublish`)
  if (dryRun) {
    for (const p of toCreate) say(`create ${SKU_PREFIX}${p.code} "${p.title}" ₹${p.price} in ${p.category}`)
    return
  }

  // --- Apply ----------------------------------------------------------------
  if (productUpdates.length) {
    await updateProductsWorkflow(container).run({ input: { products: productUpdates } })
    await updateProductVariantsWorkflow(container).run({ input: { product_variants: variantUpdates } })
  }
  if (toUnpublish.length) {
    await updateProductsWorkflow(container).run({
      input: { products: toUnpublish.map((p) => ({ id: p.id, status: ProductStatus.DRAFT })) },
    })
  }

  if (toCreate.length) {
    const fulfillment = container.resolve(Modules.FULFILLMENT)
    const salesChannels = container.resolve(Modules.SALES_CHANNEL)
    const [profile] = await fulfillment.listShippingProfiles({ type: "default" })
    const [channel] = await salesChannels.listSalesChannels({ name: "Default Sales Channel" })
    if (!profile || !channel) throw new Error("Default shipping profile or sales channel not found")

    const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    // Small batches keep each workflow transaction short.
    for (let i = 0; i < toCreate.length; i += 25) {
      const batch = toCreate.slice(i, i + 25)
      await createProductsWorkflow(container).run({
        input: {
          products: batch.map((p) => ({
            title: p.title,
            handle: `bw-${p.code.toLowerCase()}-${slug(p.title)}`,
            description: `${p.title} - ${p.category}. MRP ₹${p.mrp}, 80% discount price ₹${p.price}. Sold as ${p.unit}.`,
            status: ProductStatus.PUBLISHED,
            category_ids: [catId.get(p.category.toLowerCase())].filter(Boolean) as string[],
            shipping_profile_id: profile.id,
            options: [{ title: "Unit", values: [p.unit] }],
            variants: [
              {
                title: p.unit,
                sku: `${SKU_PREFIX}${p.code}`,
                options: { Unit: p.unit },
                manage_inventory: false,
                prices: [{ amount: p.price, currency_code: CURRENCY_CODE }],
              },
            ],
            sales_channels: [{ id: channel.id }],
          })),
        },
      })
      say(`created ${Math.min(i + 25, toCreate.length)}/${toCreate.length}`)
    }
  }

  say("done")
}
