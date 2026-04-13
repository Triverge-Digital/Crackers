"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { ShoppingCart, Check, Minus, Plus } from "lucide-react"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string
  const addedTimerRef = useRef<NodeJS.Timeout>()

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }
    if (selectedVariant?.allow_backorder) {
      return true
    }
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }
    return false
  }, [selectedVariant])

  const maxQuantity = useMemo(() => {
    if (!selectedVariant?.manage_inventory) return 10
    return Math.min(selectedVariant?.inventory_quantity || 10, 10)
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart - optimistic, fire-and-forget
  const handleAddToCart = () => {
    if (!selectedVariant?.id) return

    // Instant UI feedback
    setJustAdded(true)
    setIsAdding(true)

    if (addedTimerRef.current) clearTimeout(addedTimerRef.current)
    addedTimerRef.current = setTimeout(() => setJustAdded(false), 2500)

    // Fire API call in background - don't block UI
    addToCart({
      variantId: selectedVariant.id,
      quantity,
      countryCode,
    })
      .catch(() => {
        // Revert on error
        setJustAdded(false)
      })
      .finally(() => {
        setIsAdding(false)
      })
  }

  return (
    <>
      <div className="flex flex-col gap-y-4" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4 pb-4 border-b border-gray-200">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        {/* Quantity Selector */}
        <div className="pt-2">
          <label className="text-[10px] text-white/40 font-black uppercase tracking-[0.25em] block mb-3 ml-1">
            Quantity
          </label>
          <div className="inline-flex items-center border border-white/10 rounded-2xl overflow-hidden bg-white/5 hover:border-brand-gold-400/30 transition-colors">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="h-12 w-12 flex items-center justify-center text-white/50 hover:text-brand-gold-400 hover:bg-white/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="text"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => {
                const num = parseInt(e.target.value)
                if (!isNaN(num) && num >= 1 && num <= maxQuantity) {
                  setQuantity(num)
                }
              }}
              className="h-12 w-14 bg-transparent text-white font-bold text-center text-base border-x border-white/10 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
              disabled={quantity >= maxQuantity}
              className="h-12 w-12 flex items-center justify-center text-white/50 hover:text-brand-gold-400 hover:bg-white/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleAddToCart}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              !isValidVariant
            }
            className={`w-full h-16 text-lg tracking-[0.15em] font-black uppercase transition-all duration-300 ${
              justAdded
                ? "!bg-emerald-500 !text-white !shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                : "premium-btn"
            }`}
            data-testid="add-product-button"
          >
            {!selectedVariant && !options ? (
              "Select Options"
            ) : !inStock || !isValidVariant ? (
              "Sold Out"
            ) : justAdded ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="h-5 w-5" />
                Added to Cart
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </span>
            )}
          </Button>
        </div>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
