import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="py-12 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-8 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}

        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4 border-2 border-green-400">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Thank You!</h1>
          <p className="text-xl text-white/80">Your order was placed successfully.</p>
        </div>

        {/* Order Details Card */}
        <div
          className="card-gradient rounded-2xl p-8 text-white w-full border border-[rgba(255,255,255,0.1)] space-y-6"
          data-testid="order-complete-container"
        >
          <div className="pb-6 border-b border-[rgba(255,255,255,0.1)]">
            <OrderDetails order={order} />
          </div>

          <div className="pb-6 border-b border-[rgba(255,255,255,0.1)]">
            <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>
            <Items order={order} />
          </div>

          <div className="pb-6 border-b border-[rgba(255,255,255,0.1)]">
            <CartTotals totals={order} />
          </div>

          <div className="pb-6 border-b border-[rgba(255,255,255,0.1)]">
            <ShippingDetails order={order} />
          </div>

          <div className="pb-6 border-b border-[rgba(255,255,255,0.1)]">
            <PaymentDetails order={order} />
          </div>

          <div>
            <Help />
          </div>
        </div>
      </div>
    </div>
  )
}
