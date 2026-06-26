import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Headphones,
  Award,
  Instagram,
  MessageCircle,
  Facebook,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { pricelist } from '../data/pricelist';
import { POSTERS, FALLBACK_IMG, MIN_ORDER, Brand } from '../constants';

type HomeViewProps = {
  setActiveView: (v: string) => void;
  currentPoster: number;
  setCurrentPoster: React.Dispatch<React.SetStateAction<number>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | number>>;
  brands: Brand[];
};

export default function HomeView({ setActiveView, currentPoster, setCurrentPoster, setSelectedCategory, brands }: HomeViewProps) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col"
    >
      {/* CAROUSEL */}
      <section className="relative aspect-[3/1] w-full overflow-hidden bg-[#1A1A4E]">
         <AnimatePresence initial={false}>
            <motion.img
              key={currentPoster}
              src={POSTERS[currentPoster]}
              onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 1 }}
            />
         </AnimatePresence>

         {/* Carousel Navigation */}
         <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 flex justify-between z-20">
            <button
              onClick={() => setCurrentPoster(p => (p - 1 + POSTERS.length) % POSTERS.length)}
              className="w-10 h-10 bg-brand-magenta/80 text-white rounded-full flex items-center justify-center hover:bg-brand-magenta transition-colors shadow-lg"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setCurrentPoster(p => (p + 1) % POSTERS.length)}
              className="w-10 h-10 bg-brand-magenta/80 text-white rounded-full flex items-center justify-center hover:bg-brand-magenta transition-colors shadow-lg"
            >
              <ChevronRight size={24} />
            </button>
         </div>

         {/* Carousel Indicators (Squares) */}
         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
           {POSTERS.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 transition-all border border-white cursor-pointer ${i === currentPoster ? 'scale-110 bg-brand-magenta' : 'bg-white/40'}`}
                onClick={() => setCurrentPoster(i)}
              />
           ))}
         </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="flex flex-col md:flex-row w-full bg-white overflow-hidden">
         {/* Image Side */}
         <div className="w-full md:w-1/2 min-h-[400px] bg-brand-purple relative overflow-hidden flex items-center justify-center p-6">
            <img
              src="/discount.webp"
              alt="About BW Crackers"
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549413243-982c7f5c22f6?auto=format&fit=crop&q=80&w=800"; }}
              className="max-w-full max-h-full w-auto h-auto object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 to-transparent" />
         </div>

         {/* Text Side */}
         <div className="w-full md:w-1/2 bg-[#FDF0F6] p-8 md:p-16 flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <h2 className="text-5xl md:text-6xl text-brand-magenta uppercase tracking-wide leading-none mb-8 font-brand">
              BW CRACKERS <br/> <span className="text-3xl md:text-4xl">SIVAKASI PATTASU</span>
            </h2>

            <div className="space-y-6 text-gray-700 font-bold text-sm md:text-base leading-relaxed">
              <p>
                Welcome to BW Crackers, your premier destination for high-quality firecrackers and fireworks.
                Based in Sivakasi, the fireworks capital of India, we have been bringing joy and light to
                celebrations for over a decade.
              </p>
              <p>
                Our commitment to safety, quality, and customer satisfaction sets us apart. All our products
                are certified and tested to ensure a spectacular yet safe experience for your family and loved ones.
              </p>
              <p>
                We source directly from the finest manufacturers in Sivakasi, ensuring that every product meets
                the highest standards of quality while offering the best prices in the market with our signature
                80% discount on MRP.
              </p>
            </div>

            <button className="mt-12 bg-brand-magenta text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
              Read More
            </button>
         </div>
      </section>

      {/* MIN ORDER RIBBON */}
      <div className="bg-brand-magenta py-4 shadow-xl border-y-4 border-brand-gold/20">
         <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-wider">
              Minimum Order Value Rs.{MIN_ORDER}
            </h3>
            <p className="text-[10px] md:text-xs text-brand-gold font-bold uppercase mt-1 tracking-widest">
              Explore secure crackers for a safer environment. The order starts at a minimum price of Rs. {MIN_ORDER}.
            </p>
            <button
              onClick={() => setActiveView('order')}
              className="mt-3 bg-white text-brand-magenta px-6 py-2 rounded-full font-black text-xs uppercase hover:scale-105 transition-transform shadow-lg"
            >
              Order Now
            </button>
         </div>
      </div>

      {/* OUR PRODUCTS (CIRCULAR) SECTION */}
      <section id="categories" className="py-20 bg-gray-50 border-t border-brand-magenta/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-brand-magenta uppercase tracking-tighter mb-2 italic font-display">Our Products</h2>
              <div className="w-24 h-1.5 bg-brand-gold mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-20">
              {pricelist.slice(0, 6).map((cat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => { setSelectedCategory(cat.id); setActiveView('order'); }}
                  className="relative flex flex-col items-center cursor-pointer group"
                >
                  <div className="absolute -right-6 top-0 z-20 bg-brand-gold text-brand-purple p-3 rounded-2xl shadow-xl border-2 border-white rotate-12 flex flex-col items-center font-black scale-75 group-hover:scale-100 transition-transform">
                    <span className="text-[8px] uppercase">{cat.products.length}</span>
                    <span className="text-base uppercase leading-none">Items</span>
                  </div>
                  <div className="absolute -left-2 bottom-1/4 z-20 bg-red-600 text-white px-3 py-1 rounded-lg shadow-xl border-2 border-white -rotate-12 flex items-center font-black scale-75 group-hover:scale-100 transition-transform">
                    <span className="text-[10px] uppercase italic">Shop Now!</span>
                  </div>
                  <div className="ornate-frame w-72 h-72 md:w-80 md:h-80 shadow-2xl">
                    <div className="ornate-frame-inner">
                      <div className="w-full h-full rounded-full overflow-hidden">
                         <img
                           src={cat.products[0]?.image || FALLBACK_IMG}
                           alt={cat.name}
                           onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                         />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 text-center flex flex-col items-center">
                     <h3 className="font-black text-2xl uppercase tracking-tighter text-brand-magenta group-hover:scale-110 transition-transform">{cat.name}</h3>
                     <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 max-w-[200px] leading-tight">
                        {cat.products.length} varieties starting from ₹{Math.min(...cat.products.map(p => p.discountPrice))}
                     </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
      </section>

      {/* COLLECTIONS SECTION */}
      <section id="festive" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-brand-magenta uppercase tracking-tighter italic mb-2 font-display">Festive Collections</h2>
              <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Sparklers & Ground Chakkars",
                  desc: "Perfect for kids and family fun",
                  varieties: 45,
                  img: "/images/products/bw-1-2-3-4-kuruvi.jpeg"
                },
                {
                  title: "Aerial Fireworks",
                  desc: "Spectacular sky shows",
                  varieties: 67,
                  img: "/images/products/bw-17-baby-rocket.jpeg"
                },
                {
                  title: "Festival Combo Packs",
                  desc: "Complete celebration bundles",
                  varieties: 32,
                  img: "/images/products/bw-160-chennai-super-kings-42-items.jpeg"
                },
                {
                  title: "Sound Crackers",
                  desc: "Loud and exciting celebrations",
                  varieties: 58,
                  img: "/images/products/bw-7-2-sound-crackers.jpeg"
                }
              ].map((col, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -10 }}
                  onClick={() => setActiveView('order')}
                  className="relative aspect-[3/4] rounded-[40px] overflow-hidden cursor-pointer group shadow-2xl"
                >
                  <img
                    src={col.img}
                    alt={col.title}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A2E] via-[#0A0A2E]/40 to-transparent" />

                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                     <h3 className="text-2xl font-black text-white leading-tight mb-2 drop-shadow-lg">{col.title}</h3>
                     <p className="text-white/70 font-bold text-xs mb-6 max-w-[180px] leading-relaxed">{col.desc}</p>

                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">{col.varieties} VARIETIES</span>
                        <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-brand-purple shadow-xl group-hover:scale-110 transition-transform">
                           <ChevronRight size={20} />
                        </div>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
      </section>

      {/* OUR BRANDS SECTION */}
      <div className="bg-white py-12 border-t border-gray-100 overflow-hidden">
         <div className="container mx-auto px-4 mb-8 text-center">
            <h2 className="text-3xl font-black text-brand-magenta uppercase tracking-tighter italic mb-2 font-display">Our Brands</h2>
            <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full" />
         </div>
         <div className="relative flex whitespace-nowrap">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="flex gap-12 items-center"
            >
              {[...brands, ...brands].map((brand, i) => (
                <div
                  key={i}
                  className="w-32 h-20 flex-shrink-0 transition-all cursor-default"
                >
                  <img src={brand.logo_url} alt={brand.name} title={brand.name} className="w-full h-full object-contain" />
                </div>
              ))}
            </motion.div>
         </div>
      </div>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-20 bg-white">
         <div className="container mx-auto px-4 text-center mb-16">
            <h2 className="text-3xl font-black text-brand-magenta uppercase italic tracking-tighter mb-2 font-display">Why Choose Us</h2>
            <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full" />
         </div>

         <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ShieldCheck size={36} className="text-green-600" />, title: "Safety First", desc: "All products are certified and rigorously tested for maximum safety.", color: "bg-green-50" },
              { icon: <Truck size={36} className="text-blue-600" />, title: "Fast Delivery", desc: "Quick and secure delivery across India with careful handling.", color: "bg-blue-50" },
              { icon: <Headphones size={36} className="text-purple-600" />, title: "24/7 Support", desc: "Round the clock customer service to help you with your orders.", color: "bg-purple-50" },
              { icon: <Award size={36} className="text-orange-600" />, title: "Premium Quality", desc: "Top-notch products sourced directly from Sivakasi manufacturers.", color: "bg-orange-50" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white p-10 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center text-center transition-all group"
              >
                <div className={`w-20 h-20 rounded-3xl ${feature.color} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 rotate-3 group-hover:rotate-0`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-brand-purple uppercase tracking-tighter mb-4">{feature.title}</h3>
                <div className="w-10 h-1 bg-brand-magenta/10 mb-6" />
                <p className="text-gray-500 font-bold text-xs leading-relaxed max-w-[220px]">{feature.desc}</p>
              </motion.div>
            ))}
         </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="bg-[#0A0A2E] text-white pt-20 pb-10 border-t border-brand-gold/10">
         <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            {/* Brand Block */}
            <div className="flex flex-col">
               <div className="flex items-center gap-3 mb-6">
                  <img src="/logo.png" alt="B&W Crackers" className="h-16 w-auto object-contain drop-shadow-lg" />
               </div>
               <p className="text-gray-400 font-bold text-sm leading-relaxed mb-8">
                  Crafting celestial moments since 2010. We bring the magic of the stars to your celebrations with premium quality fireworks from Sivakasi.
               </p>
               <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-magenta transition-colors">
                     <Instagram size={20} />
                  </a>
                  <a href="https://wa.me/91XXXXXXXXXX" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#25D366] transition-colors">
                     <MessageCircle size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1877F2] transition-colors">
                     <Facebook size={20} />
                  </a>
               </div>
            </div>

            {/* Navigation */}
            <div>
               <h4 className="text-brand-gold font-black uppercase tracking-widest text-sm mb-8">Navigation</h4>
               <ul className="space-y-4 text-gray-400 font-bold text-sm">
                  <li><button onClick={() => setActiveView('home')} className="hover:text-white transition-colors">Home</button></li>
                  <li><button onClick={() => setActiveView('order')} className="hover:text-white transition-colors">Store</button></li>
                  <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><button onClick={() => setActiveView('cart')} className="hover:text-white transition-colors">Cart</button></li>
               </ul>
            </div>

            {/* Collections */}
            <div>
               <h4 className="text-brand-gold font-black uppercase tracking-widest text-sm mb-8">Collections</h4>
               <ul className="space-y-4 text-gray-400 font-bold text-sm">
                  <li><button onClick={() => setActiveView('order')} className="hover:text-white transition-colors">Single Sound Crackers</button></li>
                  <li><button onClick={() => setActiveView('order')} className="hover:text-white transition-colors">Deluxe Crackers</button></li>
                  <li><button onClick={() => setActiveView('order')} className="hover:text-white transition-colors">Bijili Crackers</button></li>
                  <li><button onClick={() => setActiveView('order')} className="hover:text-white transition-colors">Rockets</button></li>
                  <li><button onClick={() => setActiveView('order')} className="hover:text-white transition-colors">Candles</button></li>
                  <li><button onClick={() => setActiveView('order')} className="hover:text-white transition-colors">Color Pencil</button></li>
               </ul>
            </div>

            {/* Connectivity */}
            <div>
               <h4 className="text-brand-gold font-black uppercase tracking-widest text-sm mb-8">Connectivity</h4>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Mail size={18} className="text-brand-gold" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black">Inquiry</span>
                        <span className="text-sm font-bold">info@bwcrackers.com</span>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Phone size={18} className="text-brand-gold" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black">Hotline</span>
                        <span className="text-sm font-bold">+91 98765 43210</span>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-brand-gold" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black">Heritage</span>
                        <span className="text-sm font-bold">Sivakasi, Tamil Nadu, India</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Copyright Overlay */}
         <div className="container mx-auto px-6 pt-10 border-t border-white/5 text-center flex flex-col items-center gap-6">
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
               © 2026 B&W Crackers. The Art of Celebration.
            </span>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Sivakasi Direct Operations</span>
            </div>
         </div>
      </footer>
    </motion.div>
  );
}
