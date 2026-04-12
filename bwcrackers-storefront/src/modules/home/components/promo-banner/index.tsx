// modules/home/components/promo-banner.tsx
'use client'

import { Button } from "@medusajs/ui"


export function PromoBanner() {

  const onShopNow = () => {
    // Scroll to products section or navigate
    const productsSection = document.getElementById('featured-products')
    productsSection?.scrollIntoView({ behavior: 'smooth' })
  }

  
  return (
    <section className="py-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl text-white font-bold mb-4 drop-shadow-lg">
            🎉 Special Offers 🎉
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 mx-auto rounded-full mb-2"></div>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Don't miss out on these explosive deals! Limited time offers on premium firecrackers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div 
            onClick={onShopNow}
            className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-white bg-gradient-to-br from-yellow-400 to-orange-500 p-8 text-center"
          >
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-2xl font-bold text-purple-900 mb-2">80% Instant Discount</h3>
            <p className="text-purple-800 font-medium">On all premium crackers</p>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </div>
          
          <div 
            onClick={onShopNow}
            className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-white bg-gradient-to-br from-pink-400 to-purple-500 p-8 text-center"
          >
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-2xl font-bold text-white mb-2">Free Delivery</h3>
            <p className="text-white/90 font-medium">On orders above ₹2500</p>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>
    </section>
  )
}