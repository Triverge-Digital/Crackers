import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div className="w-full">
      {/* Header row - hidden on mobile */}
      <div className="hidden md:grid grid-cols-[1fr_80px_100px_120px] gap-6 px-4 pb-4 border-b border-white/10 items-center">
        <div className="text-xs font-bold text-white/40 uppercase tracking-wider">Product</div>
        <div className="text-xs font-bold text-white/40 uppercase tracking-wider text-center">Qty</div>
        <div className="text-xs font-bold text-white/40 uppercase tracking-wider text-center">Price</div>
        <div className="text-xs font-bold text-white/40 uppercase tracking-wider text-right">Total</div>
      </div>

      <div className="divide-y divide-white/5">
        {items
          ?.sort((a, b) => {
            return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
          })
          .map((item) => (
            <div key={item.id} className="py-4">
              <Item
                item={item}
                currencyCode={cart?.currency_code ?? "inr"}
              />
            </div>
          ))}
      </div>
    </div>
  )
}

export default ItemsTemplate
