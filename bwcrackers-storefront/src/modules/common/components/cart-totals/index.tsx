"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50 font-medium">Subtotal</span>
          <span className="text-sm text-white/70 font-bold" data-testid="cart-subtotal" data-value={item_subtotal || 0}>
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50 font-medium">Shipping</span>
          <span className="text-sm text-white/70 font-bold" data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {shipping_subtotal
              ? convertToLocale({ amount: shipping_subtotal, currency_code })
              : "Free"}
          </span>
        </div>
        {!!discount_subtotal && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50 font-medium">Discount</span>
            <span className="text-sm text-emerald-400 font-bold" data-testid="cart-discount" data-value={discount_subtotal || 0}>
              - {convertToLocale({ amount: discount_subtotal, currency_code })}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50 font-medium">Taxes</span>
          <span className="text-sm text-white/70 font-bold" data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />

      <div className="flex items-center justify-between pt-2">
        <span className="text-base font-black text-white uppercase tracking-wider">Total</span>
        <span
          className="text-2xl font-black text-gold tracking-tighter"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export default CartTotals
