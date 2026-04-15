"use client"

import { ArrowRight, Sparkles, Play } from "lucide-react"
import { motion } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Float } from "@modules/common/components/animations"

const AppHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-32 overflow-hidden">
      {/* Background Cinematic Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-brand-maroon/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="px-6 md:px-12 w-full max-w-[1440px]">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="flex flex-col items-start text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 bg-white border border-surface-border px-6 py-2 rounded-full mb-10 shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-brand-gold" />
              <span className="text-[10px] font-black text-brand-maroon uppercase tracking-[0.4em]">The 2026 Collection</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-h1 mb-10 text-brand-carbon leading-[0.9] max-w-xl"
            >
              CRAFTING <br />
              <span className="text-brand-maroon italic">CELESTIAL</span> <br />
              MOMENTS.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-secondary max-w-md font-bold leading-relaxed mb-12"
            >
              Experience Sivakasi&apos;s most premium artisanal firecrackers. 
              Engineered for safety, designed for awe.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6"
            >
              <LocalizedClientLink href="/store" className="app-btn app-btn-primary">
                Explore Store
                <ArrowRight size={16} />
              </LocalizedClientLink>
              <button className="app-btn app-btn-secondary">
                <Play size={16} className="fill-current" />
                View Gallery
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-20 flex items-center gap-10"
            >
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-brand-cloud overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-black text-brand-carbon uppercase tracking-widest">Trusted by 10k+</span>
                  <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Happy Celebrations</span>
               </div>
            </motion.div>
          </div>

          <div className="relative hidden lg:block">
            <Float>
                <div className="relative w-full aspect-square flex items-center justify-center">
                    {/* Main Focus Card */}
                    <div className="w-[80%] h-[80%] bento-card p-12 relative overflow-hidden flex flex-col justify-end group">
                        <div className="bg-noise absolute inset-0 pointer-events-none opacity-10"></div>
                        <img 
                          src="https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&q=80&w=800" 
                          alt="Fireworks" 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon/60 to-transparent"></div>
                        
                        <div className="relative z-10 text-white">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 block opacity-80">Premium Item</span>
                            <h3 className="text-3xl font-black uppercase tracking-tight mb-2">MEGA SPARK-X</h3>
                            <p className="text-xs font-bold opacity-70">Sivakasi&apos;s Number One aerial show.</p>
                        </div>
                    </div>

                    {/* Floating Overlay Cards */}
                    <motion.div 
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-10 -right-6 w-48 h-48 bento-card p-6 flex flex-col items-center justify-center text-center bg-white/90 backdrop-blur-md"
                    >
                        <div className="h-12 w-12 rounded-full bg-brand-soft-gold flex items-center justify-center mb-4">
                           <span className="text-2xl">🏆</span>
                        </div>
                        <span className="text-[10px] font-black text-brand-maroon uppercase tracking-widest mb-1">Top Vendor</span>
                        <span className="text-xs font-bold text-secondary uppercase">2026 Awards</span>
                    </motion.div>

                    <motion.div 
                      animate={{ x: [0, 20, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-10 -left-10 w-56 h-32 bento-card p-6 flex items-center gap-4 bg-brand-maroon text-white"
                    >
                        <div className="text-4xl font-black">80%</div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-80">Discount</span>
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Global Sale</span>
                        </div>
                    </motion.div>
                </div>
            </Float>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppHero
