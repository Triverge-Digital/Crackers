"use client"

import { Phone, Download, Calculator, Sparkles } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export function FloatingActions() {
  return (
    <>
      {/* WhatsApp Button - Bottom Left as per reference */}
      <div className="fixed bottom-6 left-6 z-[100]">
        <a
          href="https://wa.me/91XXXXXXXXXX" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all group relative"
          aria-label="Contact on WhatsApp"
        >
          <Phone size={32} className="group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 h-5 w-5 bg-white rounded-full flex items-center justify-center border-2 border-[#25D366]">
            <div className="h-2 w-2 bg-[#25D366] rounded-full animate-ping"></div>
          </div>
        </a>
      </div>

      {/* Signature Ahamed Sticky Buttons - Bottom Right */}
      <div className="fixed bottom-32 -right-2 z-[100] flex flex-col gap-4 items-end pointer-events-none">
        {/* Pricelist Download Button (Yellow/Orange Sticker style) */}
        <div className="pointer-events-auto transform translate-x-4 hover:translate-x-0 transition-all duration-300">
          <LocalizedClientLink
            href="/pricelist"
            className="flex flex-col items-center justify-center bg-gradient-to-br from-brand-orange to-[#F57C00] text-white p-4 rounded-l-[2rem] shadow-xl border-l-4 border-white/30 relative group overflow-hidden"
          >
            {/* Dot decoration */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:8px_8px]"></div>
            
            <span className="text-[10px] font-black tracking-widest leading-none mb-1 uppercase">......</span>
            <span className="text-sm font-black tracking-tighter leading-none mb-0.5 uppercase">PRICELIST</span>
            <span className="text-[11px] font-bold tracking-tight leading-none uppercase">DOWNLOAD</span>
            <span className="text-[10px] font-black tracking-widest leading-none mt-1 uppercase">......</span>

            <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Download size={40} />
            </div>
          </LocalizedClientLink>
        </div>

        {/* Estimate Now Button (Red Ribbon style) */}
        <div className="pointer-events-auto transform translate-x-6 hover:translate-x-0 transition-all duration-300">
            <button className="flex flex-col items-center justify-center bg-[#D32F2F] text-white px-6 py-2 rounded-l-full shadow-xl border-y-2 border-white/20 relative group overflow-hidden">
                <div className="absolute top-0 right-0 py-1 px-3 bg-white/20 text-[8px] font-black uppercase tracking-[0.2em] transform rotate-12 -translate-y-1 translate-x-2">New</div>
                
                <span className="text-xs font-black tracking-tight leading-none uppercase">ESTIMATE</span>
                <span className="text-[10px] font-bold tracking-widest leading-none uppercase mt-0.5">NOW!</span>
                
                <div className="mt-1 h-0.5 w-12 bg-white/30 rounded-full"></div>
                
                <div className="absolute -left-2 top-1/2 -translate-y-1/2">
                    <Calculator size={14} className="opacity-40 animate-pulse" />
                </div>
            </button>
        </div>
      </div>
    </>
  )
}
