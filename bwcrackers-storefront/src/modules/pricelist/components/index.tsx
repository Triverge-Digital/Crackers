"use client"

import { Search, Tag, Package, Download, Printer, ChevronDown, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"

export function PricelistHeader({ 
  categoryCount, 
  productCount, 
  onSearch 
}: { 
  categoryCount: number
  productCount: number
  onSearch: (query: string) => void
}) {
  return (
    <div className="bg-white border-b border-surface-border pb-16 pt-32 px-6 relative overflow-hidden">
      {/* Cinematic noise and glow */}
      <div className="bg-noise absolute inset-0 pointer-events-none opacity-5"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-maroon/5 blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-[1440px] mx-auto relative z-10 px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
          <div className="text-center md:text-left flex flex-col items-start">
            <div className="inline-flex items-center gap-3 bg-brand-cloud border border-surface-border px-6 py-2 rounded-full mb-8 shadow-sm">
                <span className="text-[10px] font-black text-brand-maroon uppercase tracking-[0.4em]">Official Catalog 2026</span>
            </div>
            <h1 className="text-h2 text-brand-carbon leading-[0.9] uppercase max-w-xl">
              PREMIUM <span className="text-brand-maroon italic">PRICELIST</span>
            </h1>
          </div>

          <div className="flex gap-4">
            <button className="app-btn app-btn-primary">
                <Download size={16} /> Download PDF
            </button>
            <button className="h-14 w-14 rounded-2xl bg-white border border-surface-border flex items-center justify-center text-brand-carbon hover:bg-brand-maroon hover:text-white transition-all shadow-sm">
                <Printer size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
             {[
                { label: "Categories", value: categoryCount, color: "text-brand-maroon" },
                { label: "Active Products", value: productCount, color: "text-brand-carbon" },
                { label: "Flat Discount", value: "80%", color: "text-brand-gold" },
                { label: "Seasonality", value: "2026", color: "text-muted" }
             ].map(stat => (
                <div key={stat.label} className="bento-card p-8 bg-brand-cloud flex flex-col items-center justify-center text-center">
                    <span className={`block text-4xl font-black ${stat.color} leading-none mb-2 tracking-tightest`}>{stat.value}</span>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted">{stat.label}</span>
                </div>
             ))}
        </div>

        <div className="relative group max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Search our brilliant collection..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-white text-brand-carbon px-14 py-7 rounded-[2.5rem] text-xl font-black border border-surface-border focus:border-brand-maroon transition-all outline-none shadow-xl shadow-brand-maroon/5 placeholder:text-muted placeholder:font-bold"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-maroon" size={24} />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 h-10 w-10 bg-brand-maroon rounded-full flex items-center justify-center text-white scale-0 group-focus-within:scale-100 transition-transform">
             <ChevronDown size={18} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PricelistItem({ 
  code, 
  name, 
  mrp, 
  unit, 
  discountPrice 
}: { 
  code: string
  name: string
  mrp: number
  unit: string
  discountPrice: number
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-white hover:shadow-2xl hover:shadow-brand-maroon/5 transition-all duration-500 border-b border-surface-border relative overflow-hidden"
    >
      <div className="flex items-center gap-8 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-brand-cloud border border-surface-border flex items-center justify-center text-xs font-black text-brand-maroon shadow-sm group-hover:bg-brand-maroon group-hover:text-white transition-all">
          {code}
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-brand-carbon group-hover:text-brand-maroon transition-colors tracking-tightest uppercase">
            {name}
          </span>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-1.5">
              <Package size={12} className="text-brand-gold" /> {unit}
            </span>
            <div className="h-1 w-1 bg-surface-border rounded-full"></div>
            <span className="text-[10px] font-black text-brand-maroon uppercase tracking-[0.2em] opacity-60">Verified Premium</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 md:mt-0 flex items-center justify-between md:justify-end gap-12 relative z-10">
        <div className="text-right flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-muted line-through opacity-40 italic">₹{mrp}</span>
                <div className="bg-brand-maroon/5 text-brand-maroon text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">80% OFF</div>
            </div>
            <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-60">₹</span>
                <span className="text-4xl font-black text-brand-maroon tracking-tightest leading-none bg-noise">
                    {discountPrice}
                </span>
                <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">/ {unit}</span>
            </div>
        </div>

        <button className="w-14 h-14 rounded-full bg-white border border-surface-border flex items-center justify-center text-brand-carbon hover:bg-brand-maroon hover:text-white transition-all shadow-sm hover:shadow-xl hover:shadow-brand-maroon/20 hover:scale-110 active:scale-95 group/btn">
            <ShoppingCart size={20} className="group-hover/btn:rotate-12 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}
