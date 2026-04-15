import { Metadata } from "next"
import { Suspense } from "react"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import { NavProgress } from "@modules/common/components/nav-progress"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { FloatingActions } from "@modules/layout/components/floating-actions"
import MobileBottomBar from "@modules/layout/components/mobile-bottom-bar"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <>
      <Suspense fallback={null}>
        <NavProgress />
      </Suspense>
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      <main className="relative min-h-screen">
        <div className="bg-noise fixed inset-0 pointer-events-none z-[-1] opacity-5"></div>
        {props.children}
      </main>
      <Footer />
      <MobileBottomBar />
      <div className="hidden md:block">
        <FloatingActions />
      </div>
    </>
  )
}
