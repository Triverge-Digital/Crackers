import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-20 flex flex-col-reverse small:flex-col gap-y-8 py-6 small:py-0 ">
      <div className="w-full card-gradient flex flex-col text-white rounded-2xl p-6 border border-[rgba(255,255,255,0.1)]">
        <div className="pb-6 border-b border-[rgba(255,255,255,0.1)]">
          <Heading
            level="h2"
            className="text-2xl font-bold text-white"
          >
            Order Summary
          </Heading>
        </div>
        
        <div className="py-6 border-b border-[rgba(255,255,255,0.1)]">
          <CartTotals totals={cart} />
        </div>

        <div className="py-6 border-b border-[rgba(255,255,255,0.1)]">
          <h3 className="text-lg font-semibold text-white mb-4">Items</h3>
          <ItemsPreviewTemplate cart={cart} />
        </div>

        <div className="pt-4">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
