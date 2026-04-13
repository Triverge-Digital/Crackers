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
    <div className="celebration-bg min-h-screen relative overflow-hidden py-24">
       {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[400px] bg-brand-gold-400/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="content-container relative z-10" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="space-y-16">
            {/* Cinematic Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
               <div className="inline-flex items-center gap-3 glass-gold px-6 py-2 rounded-full mb-6 border border-brand-gold-400/20 shadow-glow-gold animate-sparkle">
                 <span className="text-[10px] font-black text-brand-gold-200 uppercase tracking-[0.3em]">Curated Selection</span>
               </div>
               <h1 className="text-h1 text-white mb-6">
                 Your <span className="text-gold italic">Celebration</span> Trove
               </h1>
               <div className="h-1 w-20 bg-brand-gold-400 mx-auto rounded-full opacity-30"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">
              <div className="space-y-12">
                {/* Cart Items */}
                <div className="glass-card rounded-[2.5rem] p-10 border border-white/10 shadow-glow-gold/5 relative overflow-hidden transition-all duration-500 hover:border-brand-gold-400/20">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                   
                  <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-white font-serif tracking-tight">
                        Manifested Wonders
                      </h2>
                      <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-2 px-1">
                        {cart.items.length} Distinct artifact{cart.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <ItemsTemplate cart={cart} />
                </div>
              </div>

              <aside className="space-y-10 lg:sticky lg:top-32">
                {/* Order Summary */}
                <div className="glass-card rounded-[2.5rem] p-10 border border-white/10 shadow-glow-gold/5 relative overflow-hidden group hover:border-brand-gold-400/30 transition-all duration-500">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                   
                  <h3 className="text-[10px] font-black text-brand-gold-400 uppercase tracking-[0.4em] mb-10 pb-4 border-b border-white/5">
                    Order Summary
                  </h3>
                  {cart && cart.region && <Summary cart={cart as any} />}
                  
                  <div className="mt-10 p-6 glass-gold border border-brand-gold-400/20 rounded-2xl">
                    <p className="text-[10px] font-black text-brand-gold-400 uppercase tracking-widest text-center leading-relaxed">
                      Complimentary Concierge Delivery <br />
                      <span className="text-white/40">on orders above ₹999</span>
                    </p>
                  </div>
                </div>

                {/* Place Order Form */}
                <div className="glass-card rounded-[2.5rem] p-10 border border-white/10 shadow-glow-gold/5 transition-all duration-500 hover:border-brand-gold-400/10">
                  <h3 className="text-[10px] font-black text-brand-gold-400 uppercase tracking-[0.4em] mb-10 pb-4 border-b border-white/5">
                    Secure Passage
                  </h3>
                  <PlaceOrderForm cart={cart} />
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
