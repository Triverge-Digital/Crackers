import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="celebration-bg min-h-screen relative overflow-hidden py-24">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[400px] bg-brand-gold-400/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="content-container relative z-10">
        <div className="text-center mb-16">
           <div className="inline-flex items-center gap-3 glass-gold px-6 py-2 rounded-full mb-6 border border-brand-gold-400/20 shadow-glow-gold animate-sparkle">
             <span className="text-[10px] font-black text-brand-gold-200 uppercase tracking-[0.3em]">Imperial Checkout</span>
           </div>
           <h1 className="text-h1 text-white mb-6">
             Finalize Your <span className="text-gold italic">Celebration</span>
           </h1>
           <div className="h-1 w-20 bg-brand-gold-400 mx-auto rounded-full opacity-30"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start">
          <div className="glass-card p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-glow-gold/10 relative overflow-hidden transition-all duration-500 hover:border-brand-gold-400/10">
             <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
             
            <PaymentWrapper cart={cart}>
              <CheckoutForm cart={cart} customer={customer} />
            </PaymentWrapper>
          </div>

          <aside className="lg:sticky lg:top-32 space-y-12">
            <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 shadow-glow-gold/5 relative overflow-hidden group hover:border-brand-gold-400/20 transition-all duration-500">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
               
              <h3 className="text-[10px] font-black text-brand-gold-400 uppercase tracking-[0.4em] mb-10 pb-4 border-b border-white/5">
                Summary of Artifacts
              </h3>
              <CheckoutSummary cart={cart} />
            </div>

            <div className="glass-gold p-8 rounded-[2rem] border border-brand-gold-400/20 text-center">
               <p className="text-[10px] font-black text-brand-gold-400 uppercase tracking-widest leading-relaxed">
                 Secured by Elite Encryption <br />
                 <span className="text-white/40">Verified Premium Merchant</span>
               </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
