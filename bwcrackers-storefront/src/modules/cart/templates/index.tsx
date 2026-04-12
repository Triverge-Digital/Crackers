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
    <div className="py-12 bg-gradient-to-br from-gray-50 to-orange-50 min-h-screen">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="space-y-8">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100">
              <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                    Shopping Cart
                  </h1>
                  <p className="text-gray-500 mt-2">
                    {cart.items.length} item
                    {cart.items.length !== 1 ? "s" : ""} in your cart
                  </p>
                </div>
              </div>
              <ItemsTemplate cart={cart} />
            </div>

            {/* Summary + Place Order */}
            <div className="grid grid-cols-1 small:grid-cols-[1fr_420px] gap-8">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 h-fit">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Order Summary
                </h2>
                {cart && cart.region && <Summary cart={cart as any} />}
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    Free delivery on orders above Rs.999
                  </p>
                </div>
              </div>

              {/* Place Order Form */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Place Your Order
                </h2>
                <PlaceOrderForm cart={cart} />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
