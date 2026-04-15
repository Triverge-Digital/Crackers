import InteractiveLink from "@modules/common/components/interactive-link"
import { ShoppingBag } from "lucide-react"

const EmptyCartMessage = () => {
  return (
    <div
      className="py-24 px-6 flex flex-col justify-center items-center text-center"
      data-testid="empty-cart-message"
    >
      <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <ShoppingBag className="w-10 h-10 text-white/30" />
      </div>
      <h2 className="text-2xl font-black text-white mb-3">
        Your Cart is Empty
      </h2>
      <p className="text-white/40 text-sm mb-8 max-w-sm">
        Looks like you haven&apos;t added any items yet. Browse our collection to get started!
      </p>
      <InteractiveLink href="/store">
        <span className="bg-brand-gold-400 text-brand-royal-950 px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-gold-500 transition-colors inline-block">
          Browse Products
        </span>
      </InteractiveLink>
    </div>
  )
}

export default EmptyCartMessage
