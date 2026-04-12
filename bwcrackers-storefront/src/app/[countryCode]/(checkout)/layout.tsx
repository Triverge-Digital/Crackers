import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full relative min-h-screen text-white bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 h-16 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-lg">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-white/80 hover:text-white flex items-center gap-x-2 uppercase flex-1 basis-0 transition"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block text-sm font-semibold">Back to Cart</span>
            <span className="mt-px block small:hidden text-sm font-semibold">Back</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="text-2xl font-bold text-yellow-300 hover:text-yellow-200 uppercase tracking-wider transition"
            data-testid="store-link"
          >
            BW CRACKERS
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="relative z-20 py-8" data-testid="checkout-container">
        <div className="content-container max-w-4xl mx-auto">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20 py-6 w-full flex items-center justify-center border-t border-white/10">
        <MedusaCTA />
      </div>
    </div>
  )
}
