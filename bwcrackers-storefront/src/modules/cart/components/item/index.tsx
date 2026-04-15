"use client"

import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [optimisticQty, setOptimisticQty] = useState<number | null>(null)

  const displayQty = optimisticQty ?? item.quantity

  const changeQuantity = (quantity: number) => {
    setError(null)
    setOptimisticQty(quantity)
    setUpdating(true)

    updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
        setOptimisticQty(null)
      })
      .finally(() => {
        setUpdating(false)
        setOptimisticQty(null)
      })
  }

  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  if (type === "preview") {
    return (
      <div className="flex items-center gap-x-4 py-2 group">
        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-white/5">
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </div>
        <div className="flex flex-col flex-1 gap-y-1">
          <span className="text-white text-xs font-bold truncate">{item.product_title}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">{item.quantity}x</span>
            <LineItemPrice item={item} style="tight" currencyCode={currencyCode} className="text-brand-gold-400 font-bold text-xs" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div data-testid="product-row">
      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-[1fr_80px_100px_120px] gap-6 items-center">
        <div className="flex items-center gap-x-4">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>
          <div className="flex flex-col gap-y-1 overflow-hidden min-w-0">
            <h3 className="text-white font-bold text-sm truncate">
              {item.product_title}
            </h3>
            <LineItemOptions variant={item.variant} className="text-xs text-white/40" data-testid="product-variant" />
            <DeleteButton
              id={item.id}
              className="text-xs text-white/30 hover:text-red-400 transition-colors mt-1 w-fit"
              data-testid="product-delete-button"
            >
              Remove
            </DeleteButton>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <CartItemSelect
              value={displayQty}
              onChange={(qty) => changeQuantity(qty)}
              max={Math.min(maxQuantity, 10)}
              disabled={updating}
            />
            {updating && (
              <div className="absolute inset-0 flex items-center justify-center bg-brand-royal-950/60 rounded-lg">
                <Spinner className="w-4 h-4 text-brand-gold-400" />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center text-white/50 text-sm font-medium">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>

        <div className="text-right">
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
            className="text-brand-gold-400 font-bold text-base"
          />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex gap-4">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
        <div className="flex flex-col flex-1 min-w-0 gap-y-2">
          <h3 className="text-white font-bold text-sm truncate">
            {item.product_title}
          </h3>
          <LineItemOptions variant={item.variant} className="text-xs text-white/40" />
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3">
              <div className="relative">
                <CartItemSelect
                  value={displayQty}
                  onChange={(qty) => changeQuantity(qty)}
                  max={Math.min(maxQuantity, 10)}
                  disabled={updating}
                />
                {updating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-royal-950/60 rounded-lg">
                    <Spinner className="w-3 h-3 text-brand-gold-400" />
                  </div>
                )}
              </div>
              <DeleteButton
                id={item.id}
                className="text-xs text-white/30 hover:text-red-400 transition-colors"
                data-testid="product-delete-button"
              >
                Remove
              </DeleteButton>
            </div>
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
              className="text-brand-gold-400 font-bold text-sm"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-2">
          <ErrorMessage error={error} data-testid="product-error-message" />
        </div>
      )}
    </div>
  )
}

export default Item
