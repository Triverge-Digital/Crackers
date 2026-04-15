import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import PlaceOrderForm from "../components/place-order-form"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="min-h-screen bg-brand-royal-950 py-8 md:py-12">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Your Cart
              </h1>
              <p className="text-white/40 text-sm mt-1">
                {cart.items.length} item{cart.items.length !== 1 ? "s" : ""} in your cart
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
              {/* Left Column: Cart Items + Form */}
              <div className="space-y-8">
                {/* Cart Items */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
                  <ItemsTemplate cart={cart} />
                </div>

                {/* User Details Form */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="text-lg font-black text-white tracking-tight">
                      Your Details
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                      Fill in your details and our team will contact you to confirm your order. No online payment required.
                    </p>
                  </div>
                  <PlaceOrderForm cart={cart} />
                </div>
              </div>

              {/* Right Column: Order Summary (sticky) */}
              <aside className="lg:sticky lg:top-28">
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 pb-4 border-b border-white/10">
                    Order Summary
                  </h3>
                  {cart && cart.region && <Summary cart={cart as any} />}

                  <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <p className="text-xs text-emerald-400 font-bold text-center leading-relaxed">
                      Free Delivery on orders above ₹999
                    </p>
                  </div>

                  <div className="mt-4 p-4 bg-brand-gold-400/10 border border-brand-gold-400/20 rounded-xl">
                    <p className="text-xs text-brand-gold-400 font-bold text-center leading-relaxed">
                      Payment upon delivery only — no online payment
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <div className="py-20">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
