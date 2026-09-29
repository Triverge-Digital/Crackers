import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const PACKING_FEE_PCT = 0.02
export const CURRENCY_CODE = "inr"
export const SKU_PREFIX = "BW-"

export type RequestedItem = { code: string; quantity: number }

export type PricedItem = {
  code: string
  sku: string
  title: string
  variant_title: string | null
  quantity: number
  unit_price: number
}

export type PricedOrder = {
  items: PricedItem[]
  subtotal: number
  packing_fee: number
  grand_total: number
  unknown_codes: string[]
}

export class PricingError extends Error {
  constructor(message: string, public readonly unknownCodes: string[] = []) {
    super(message)
    this.name = "PricingError"
  }
}

export function computePackingFee(subtotal: number): number {
  return Math.ceil(subtotal * PACKING_FEE_PCT)
}

/**
 * Prices a list of `{ code, quantity }` items against the Medusa catalog.
 * Prices always come from the variant's INR price, never from the client.
 * Duplicate codes are merged. Throws PricingError when any code is unknown
 * or has no INR price.
 */
export async function priceItems(
  container: MedusaContainer,
  requested: RequestedItem[]
): Promise<PricedOrder> {
  const merged = new Map<string, number>()
  for (const item of requested) {
    const code = String(item.code).trim().toUpperCase()
    merged.set(code, (merged.get(code) ?? 0) + item.quantity)
  }

  const skus = [...merged.keys()].map((code) => `${SKU_PREFIX}${code}`)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: variants } = await query.graph({
    entity: "variant",
    fields: ["sku", "title", "product.title", "prices.amount", "prices.currency_code"],
    filters: { sku: skus },
  })

  type VariantRow = {
    sku: string | null
    title: string | null
    product?: { title?: string | null } | null
    prices?: Array<{ amount: number; currency_code: string }> | null
  }

  const bySku = new Map<string, VariantRow>()
  for (const v of variants as unknown as VariantRow[]) {
    if (v.sku) bySku.set(v.sku.toUpperCase(), v)
  }

  const items: PricedItem[] = []
  const unknown: string[] = []

  for (const [code, quantity] of merged) {
    const sku = `${SKU_PREFIX}${code}`
    const variant = bySku.get(sku)
    const price = variant?.prices?.find(
      (p) => p && p.currency_code === CURRENCY_CODE && typeof p.amount === "number"
    )
    if (!variant || !price) {
      unknown.push(code)
      continue
    }
    items.push({
      code,
      sku,
      title: variant.product?.title ?? variant.title ?? sku,
      variant_title: variant.title ?? null,
      quantity,
      unit_price: Number(price.amount),
    })
  }

  if (unknown.length) {
    throw new PricingError(
      `These item codes are not in the current price list: ${unknown.join(", ")}`,
      unknown
    )
  }

  const subtotal = items.reduce((sum, it) => sum + it.unit_price * it.quantity, 0)
  const packing_fee = computePackingFee(subtotal)

  return {
    items,
    subtotal,
    packing_fee,
    grand_total: subtotal + packing_fee,
    unknown_codes: [],
  }
}
