"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="flex flex-col justify-center gap-y-6">
      {/* Header */}
      <div className="flex gap-2 justify-between items-center pb-6 border-b border-[rgba(255,255,255,0.1)]">
        <h1 className="text-4xl font-bold text-white">Order Details</h1>
        <LocalizedClientLink
          href="/account/orders"
          className="flex gap-2 items-center text-white/70 hover:text-white transition"
          data-testid="back-to-overview-button"
        >
          <XMark size={20} /> Back
        </LocalizedClientLink>
      </div>

      {/* Order Content */}
      <div
        className="card-gradient rounded-2xl p-8 text-white space-y-6 border border-[rgba(255,255,255,0.1)]"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <div className="border-t border-[rgba(255,255,255,0.1)] pt-6">
          <Items order={order} />
        </div>
        <div className="border-t border-[rgba(255,255,255,0.1)] pt-6">
          <ShippingDetails order={order} />
        </div>
        <div className="border-t border-[rgba(255,255,255,0.1)] pt-6">
          <OrderSummary order={order} />
        </div>
        <div className="border-t border-[rgba(255,255,255,0.1)] pt-6">
          <Help />
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
