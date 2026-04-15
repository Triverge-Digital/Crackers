"use client"

import { useState } from "react"
import { PricelistHeader, PricelistItem } from "@modules/pricelist/components"
import { PRICE_LIST_DATA } from "@lib/constants/price-list-data"
import { ChevronDown, Search } from "lucide-react"

export default function PricelistPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const categoryCount = PRICE_LIST_DATA.length
  const productCount = PRICE_LIST_DATA.reduce((acc, cat) => acc + cat.items.length, 0)

  const filteredData = PRICE_LIST_DATA.map((category) => ({
    ...category,
    items: category.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.items.length > 0)

  return (
    <div className="min-h-screen bg-brand-cloud pb-32">
      <PricelistHeader 
        categoryCount={categoryCount} 
        productCount={productCount} 
        onSearch={setSearchQuery} 
      />

      <div className="px-6 md:px-12 max-w-[1440px] mx-auto mt-20 space-y-16">
        {filteredData.map((category, idx) => (
          <div key={category.name}>
            <div className="flex items-center gap-6 mb-10 hover:translate-x-2 transition-transform duration-500 group">
                <div className="h-0.5 w-12 bg-brand-maroon rounded-full transition-all group-hover:w-20"></div>
                <h2 className="text-3xl font-black text-brand-carbon uppercase tracking-tightest flex items-center gap-4">
                    <span className="text-brand-gold opacity-50 italic">#</span> {category.name}
                </h2>
                <div className="h-px flex-1 bg-surface-border hidden md:block"></div>
                <div className="text-[10px] font-black text-brand-maroon uppercase tracking-[0.4em] opacity-40">Section {idx + 1}</div>
            </div>

            <div className="bento-card overflow-hidden bg-white">
                <div className="divide-y divide-surface-border">
                    {category.items.map((item) => (
                      <PricelistItem key={item.code} {...item} />
                    ))}
                </div>
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="bento-card p-32 flex flex-col items-center justify-center text-center bg-white">
            <div className="w-24 h-24 rounded-full bg-brand-cloud border border-dashed border-brand-maroon/20 flex items-center justify-center mb-8">
               <Search className="text-brand-maroon/20" size={40} />
            </div>
            <h3 className="text-2xl font-black text-brand-carbon uppercase mb-2">No Fireworks Found</h3>
            <p className="text-[10px] font-black text-brand-maroon uppercase tracking-[0.4em] opacity-60">Try searching for something else!</p>
          </div>
        )}
      </div>
    </div>
  )
}
