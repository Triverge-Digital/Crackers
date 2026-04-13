"use client"

import { Table, Text, clx } from "@medusajs/ui"
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
        setOptimisticQty(null) // revert on error
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
        <div className="w-12 h-12 glass-card rounded-xl overflow-hidden border border-white/5 relative">
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </div>
        <div className="flex flex-col flex-1 gap-y-1">
          <span className="text-white text-xs font-bold truncate group-hover:text-gold transition-colors">{item.product_title}</span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">{item.quantity}x</span>
            <LineItemPrice item={item} style="tight" currencyCode={currencyCode} className="text-gold font-bold text-[10px]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[1fr_80px_100px_120px] gap-6 items-center group relative overflow-hidden" data-testid="product-row">
      <div className="flex items-center gap-x-6">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="w-20 h-20 glass-card rounded-2xl overflow-hidden border border-white/5 relative shrink-0"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
        <div className="flex flex-col gap-y-1 overflow-hidden">
          <h3 className="text-white font-black text-sm tracking-tight truncate group-hover:text-gold transition-colors">
            {item.product_title}
          </h3>
          <LineItemOptions variant={item.variant} className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black" data-testid="product-variant" />
          <DeleteButton 
            id={item.id} 
            className="text-[9px] text-white/10 hover:text-brand-accent-hot transition-colors uppercase font-black tracking-widest mt-2 block w-fit" 
            data-testid="product-delete-button" 
          >
            Relinquish
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
            <div className="absolute inset-0 flex items-center justify-center bg-brand-royal-950/50 rounded-xl backdrop-blur-sm">
              <Spinner className="w-4 h-4 text-brand-gold-400" />
            </div>
          )}
        </div>
      </div>

      <div className="hidden small:flex justify-center text-white/30 text-xs font-bold">
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
          className="text-gold font-black text-lg tracking-tighter"
        />
      </div>
      
      {error && (
        <div className="col-span-4 mt-2">
          <ErrorMessage error={error} data-testid="product-error-message" />
        </div>
      )}
    </div>
  )
}

export default Item
