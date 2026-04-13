import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div className="w-full">
      <div className="grid grid-cols-[1fr_80px_100px_120px] gap-6 px-6 pb-6 border-b border-white/5 items-center">
        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Artifact</div>
        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] text-center">Qty</div>
        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] text-center hidden small:block">Unit Price</div>
        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] text-right">Investment</div>
      </div>
      
      <div className="pt-6 space-y-8">
        {items
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={cart?.currency_code}
                  />
                )
              })
          : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
      </div>
    </div>
  )
}

export default ItemsTemplate
