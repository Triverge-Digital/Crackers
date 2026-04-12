"use client"

import CartTotals from "@modules/common/components/cart-totals"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const Summary = ({ cart }: SummaryProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <CartTotals totals={cart} />
    </div>
  )
}

export default Summary
