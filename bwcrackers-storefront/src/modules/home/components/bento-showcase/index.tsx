"use client"

import { Sparkles, ArrowUpRight, Flame, Ghost, Zap, PartyPopper } from "lucide-react"
import { motion } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categories = [
  {
    name: "Sparklers",
    handle: "sparklers",
    image: "https://images.unsplash.com/photo-1533230393046-2f64453530f2?auto=format&fit=crop&q=80&w=400",
    color: "bg-brand-soft-gold",
    icon: Sparkles,
    size: "lg:col-span-2 lg:row-span-2",
    description: "Elegant golden showers for all ages."
  },
  {
    name: "Flower Pots",
    handle: "flower-pots",
    image: "https://images.unsplash.com/photo-1549413216-203588720138?auto=format&fit=crop&q=80&w=400",
    color: "bg-brand-cloud",
    icon: Flame,
    size: "lg:col-span-1 lg:row-span-1",
    description: "Classic fountains of joy."
  },
  {
    name: "Aerial Show",
    handle: "aerial",
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&q=80&w=400",
    color: "bg-brand-maroon/5",
    icon: Zap,
    size: "lg:col-span-1 lg:row-span-2",
    description: "Paint the sky with brilliant colors."
  },
  {
    name: "Ground Chakkars",
    handle: "chakkars",
    image: "https://images.unsplash.com/photo-1605706541585-0644464c78fe?auto=format&fit=crop&q=80&w=400",
    color: "bg-white",
    icon: Ghost,
    size: "lg:col-span-1 lg:row-span-1",
    description: "Spinning brilliance on the ground."
  },
  {
    name: "Gift Boxes",
    handle: "gift-boxes",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400",
    color: "bg-brand-cloud",
    icon: PartyPopper,
    size: "lg:col-span-2 lg:row-span-1",
    description: "Perfectly curated festival combos for family."
  }
]

const BentoShowcase = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-display mb-6 block">Categories</span>
            <h2 className="text-h2 text-brand-carbon mb-8">
              DISCOVER YOUR <span className="text-brand-maroon italic">BRIGHTEST</span> MOMENTS
            </h2>
            <div className="h-0.5 w-16 bg-brand-maroon mx-auto rounded-full mb-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[800px]">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.handle}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative overflow-hidden bento-card ${cat.size} flex flex-col`}
            >
               {/* Background Image with Overlay */}
               <div className="absolute inset-0 z-0">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 group-hover:opacity-60 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
               </div>

               <div className="relative z-10 p-10 flex flex-col h-full items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-surface-border flex items-center justify-center shadow-lg mb-6 group-hover:bg-brand-maroon group-hover:text-white transition-all">
                     <cat.icon size={24} />
                  </div>
                  
                  <div className="mt-auto w-full">
                    <div className="flex justify-between items-end mb-4">
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-black text-brand-carbon tracking-tightest leading-none mb-2 uppercase">
                                {cat.name}
                            </h3>
                            <p className="text-sm font-bold text-secondary line-clamp-2 max-w-[200px]">
                                {cat.description}
                            </p>
                        </div>
                        <LocalizedClientLink 
                            href={`/categories/${cat.handle}`}
                            className="w-12 h-12 rounded-full border border-surface-border flex items-center justify-center hover:bg-brand-maroon hover:text-white transition-all shadow-sm"
                        >
                            <ArrowUpRight size={20} />
                        </LocalizedClientLink>
                    </div>
                  </div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BentoShowcase
