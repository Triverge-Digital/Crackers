import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Search, 
  ChevronDown, 
  Percent, 
  Phone,
  MessageCircle,
  Plus,
  Minus,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  Truck,
  Headphones,
  Award,
  Star,
  X,
  Home,
  Package,
  Instagram,
  Facebook,
  Mail,
  MapPin
} from 'lucide-react';
import { pricelist } from './data/pricelist';

const POSTERS = [
  "/banner1.png",
  "/banner2.png",
  "/banner3.png",
  "/banner4.png"
];

const BRANDS = [
  "/brand1.png",
  "/brand2.png",
  "/brand3.png",
  "/brand4.png",
  "/brand5.png",
  "/brand6.png",
  "/brand7.png",
  "/brand8.png",
  "/brand9.png"
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1549413243-982c7f5c22f6?auto=format&fit=crop&q=80&w=1200";

const MIN_ORDER = 3000;

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [cart, setCart] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPoster, setCurrentPoster] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('new');

  const allProducts = useMemo(() => {
    let flattened = [];
    pricelist.forEach(cat => {
      cat.products.forEach(p => {
        if (selectedCategory === 'all' || selectedCategory === cat.id) {
          if (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            flattened.push({ ...p, categoryId: cat.id, categoryName: cat.name });
          }
        }
      });
    });

    if (sortBy === 'price-asc') flattened.sort((a, b) => a.discountPrice - b.discountPrice);
    if (sortBy === 'price-desc') flattened.sort((a, b) => b.discountPrice - a.discountPrice);
    
    return flattened;
  }, [selectedCategory, sortBy, searchQuery]);

  const updateQty = (code, delta) => {
    setCart(prev => {
      const current = prev[code] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [code]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [code]: next };
    });
  };

  const totals = useMemo(() => {
    let total = 0;
    let count = 0;
    pricelist.forEach(cat => {
      cat.products.forEach(p => {
        if (cart[p.code]) {
          total += p.discountPrice * cart[p.code];
          count += cart[p.code];
        }
      });
    });
    return { total, count };
  }, [cart]);

  useEffect(() => {
    if (activeView === 'home') {
      const timer = setInterval(() => setCurrentPoster(p => (p + 1) % POSTERS.length), 5000);
      return () => clearInterval(timer);
    }
  }, [activeView]);

  return (
    <div className="min-h-screen bg-[#FDF0F6] flex flex-col font-sans selection:bg-brand-magenta selection:text-white">
      
      {/* ANNOUNCEMENT BAR */}
      <div className="bg-brand-purple py-2 overflow-hidden border-b border-brand-gold/20 sticky top-0 z-[60]">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="whitespace-nowrap flex gap-12 text-[10px] md:text-xs font-black uppercase tracking-widest text-brand-gold"
        >
          {[1, 2, 3, 4].map((_, i) => (
            <React.Fragment key={i}>
              <span>🔥 FLAT 80% DISCOUNT ON ALL CRACKERS 🎇</span>
              <span>🚚 DIRECT SIVAKASI DELIVERY 📦</span>
              <span>✨ MINIMUM ORDER VALUE ₹{MIN_ORDER} ONLY ✨</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#1A1A4E] to-[#2D1B6B] text-white py-3 px-4 sticky top-[32px] z-50 shadow-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('home')}>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1" style={{ boxShadow: '0 0 15px rgba(255,255,255,0.5)' }}>
               <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-black italic tracking-tighter leading-none">BW CRACKERS</span>
              <span className="text-[10px] text-brand-gold uppercase tracking-widest font-extrabold text-amber-400">Official Store</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => setActiveView('home')} className={`text-xs font-black uppercase tracking-widest hover:text-brand-gold transition-colors ${activeView === 'home' ? 'text-brand-gold' : 'text-white/70'}`}>Home</button>
            <button onClick={() => setActiveView('order')} className={`text-xs font-black uppercase tracking-widest hover:text-brand-gold transition-colors ${activeView === 'order' ? 'text-brand-gold' : 'text-white/70'}`}>Store</button>
            <button onClick={() => { setActiveView('home'); setTimeout(() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-xs font-black uppercase tracking-widest text-white/70 hover:text-brand-gold transition-colors">Collections</button>
            <button onClick={() => { setActiveView('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-xs font-black uppercase tracking-widest text-white/70 hover:text-brand-gold transition-colors">About</button>
            <button onClick={() => setActiveView('order')} className="text-xs font-black uppercase tracking-widest text-white/70 hover:text-brand-gold transition-colors">Cart</button>
          </nav>
          
          <button 
            onClick={() => setActiveView(activeView === 'home' ? 'order' : 'home')}
            className="bg-red-600 px-4 py-2 rounded-xl shadow-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition-all active:scale-95"
          >
            {activeView === 'home' ? <Download size={18} /> : <Home size={18} />}
            {activeView === 'home' ? 'Pricelist' : 'Home'}
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeView === 'home' ? (
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
               <div className="w-full md:w-1/2 min-h-[400px] bg-brand-purple relative overflow-hidden">
                  <img 
                    src="/bw-about.png" 
                    alt="About BW Crackers"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549413243-982c7f5c22f6?auto=format&fit=crop&q=80&w=800"; }}
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 to-transparent" />
               </div>

               {/* Text Side */}
               <div className="w-full md:w-1/2 bg-[#FDF0F6] p-8 md:p-16 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                  <h2 className="text-4xl md:text-5xl font-black text-brand-magenta uppercase italic tracking-tighter leading-none mb-8">
                    BW CRACKERS <br/> SIVAKASI PATTASU
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
                    <h2 className="text-4xl font-black text-brand-magenta uppercase tracking-tighter mb-2 italic">Our Products</h2>
                    <div className="w-24 h-1.5 bg-brand-gold mx-auto rounded-full" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-20">
                    {pricelist.slice(0, 6).map((cat, idx) => (
                      <motion.div 
                        key={idx} 
                        whileHover={{ scale: 1.05 }}
                        className="relative flex flex-col items-center cursor-default group"
                      >
                        <div className="absolute -right-6 top-0 z-20 bg-brand-gold text-brand-purple p-3 rounded-2xl shadow-xl border-2 border-white rotate-12 flex flex-col items-center font-black scale-75 group-hover:scale-100 transition-transform">
                          <span className="text-[8px] uppercase">Pricelist</span>
                          <span className="text-base uppercase leading-none">Download</span>
                        </div>
                        <div className="absolute -left-2 bottom-1/4 z-20 bg-red-600 text-white px-3 py-1 rounded-lg shadow-xl border-2 border-white -rotate-12 flex items-center font-black scale-75 group-hover:scale-100 transition-transform">
                          <span className="text-[10px] uppercase italic">Estimate Now!</span>
                        </div>
                        <div className="ornate-frame w-72 h-72 md:w-80 md:h-80 shadow-2xl">
                          <div className="ornate-frame-inner">
                            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center group-hover:bg-brand-magenta/20 transition-colors">
                               <Package size={80} className="text-white opacity-40" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-8 text-center flex flex-col items-center">
                           <h3 className="font-black text-2xl uppercase tracking-tighter text-brand-magenta group-hover:scale-110 transition-transform">{cat.name}</h3>
                           <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 max-w-[200px] leading-tight">
                              Ignite the night with enchanting {cat.name.toLowerCase()} that paint the sky.
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
                    <h2 className="text-3xl font-black text-brand-magenta uppercase tracking-tighter italic mb-2">Festive Collections</h2>
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
                  <h2 className="text-3xl font-black text-brand-magenta uppercase tracking-tighter italic mb-2">Our Brands</h2>
                  <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full" />
               </div>
               <div className="relative flex whitespace-nowrap">
                  <motion.div 
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="flex gap-12 items-center"
                  >
                    {[...BRANDS, ...BRANDS].map((brand, i) => (
                      <div 
                        key={i} 
                        className="w-32 h-20 flex-shrink-0 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100 cursor-default"
                      >
                        <img src={brand} alt="Brand" className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </motion.div>
               </div>
            </div>

            {/* WHY CHOOSE US SECTION */}
            <section className="py-20 bg-white">
               <div className="container mx-auto px-4 text-center mb-16">
                  <h2 className="text-3xl font-black text-brand-magenta uppercase italic tracking-tighter mb-2">Why Choose Us</h2>
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
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-glow">
                           <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-2xl font-black italic tracking-tighter leading-none">B&W CRACKERS</span>
                        </div>
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
                        <li><button onClick={() => setActiveView('order')} className="hover:text-white transition-colors">Cart</button></li>
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
        ) : (
          <motion.div 
            key="order"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full min-h-screen gap-8 p-4 md:p-8 pb-40"
          >
            {/* SIDEBAR - REFINE SELECTION */}
            <aside className="w-full lg:w-72 flex-shrink-0">
               <div className="sticky top-[100px] space-y-8">
                  <div className="bg-[#1A1A4E] rounded-[32px] p-8 border border-white/5 shadow-2xl">
                     <h3 className="text-brand-gold font-black uppercase tracking-[0.2em] text-[10px] mb-8">Refine Selection</h3>
                     
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-4">Sort by</label>
                           <div className="space-y-2">
                              {[
                                 { id: 'new', label: 'New Arrivals' },
                                 { id: 'low-high', label: 'Price: Low to High' },
                                 { id: 'high-low', label: 'Price: High to Low' }
                              ].map(sort => (
                                 <button 
                                   key={sort.id}
                                   onClick={() => setSortBy(sort.id)}
                                   className={`w-full text-left px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${sortBy === sort.id ? 'bg-brand-magenta/10 border-brand-magenta text-white shadow-lg shadow-brand-magenta/20' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
                                 >
                                    <div className="flex items-center gap-3">
                                       <div className={`w-1.5 h-1.5 rounded-full ${sortBy === sort.id ? 'bg-brand-magenta animate-pulse' : 'bg-gray-600'}`} />
                                       {sort.label}
                                    </div>
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-4">Categories</label>
                           <div className="flex flex-wrap lg:flex-col gap-2">
                              <button 
                                onClick={() => setSelectedCategory('all')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === 'all' ? 'bg-brand-gold text-brand-purple' : 'bg-white/5 text-gray-400'}`}
                              > All items </button>
                              {pricelist.map(cat => (
                                 <button 
                                   key={cat.id}
                                   onClick={() => setSelectedCategory(cat.id)}
                                   className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${selectedCategory === cat.id ? 'bg-brand-gold text-brand-purple shadow-lg shadow-brand-gold/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                 >
                                    {cat.name}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* MIN ORDER STATUS SIDEBAR */}
                  <div className={`rounded-[32px] p-8 border ${totals.total >= MIN_ORDER ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} shadow-2xl`}>
                     <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Total Estimate</span>
                     <div className="flex items-end gap-2 mb-4">
                        <span className={`text-4xl font-black italic tracking-tighter ${totals.total >= MIN_ORDER ? 'text-green-500' : 'text-red-500'}`}>₹{totals.total.toLocaleString()}</span>
                     </div>
                     {totals.total < MIN_ORDER ? (
                        <div className="space-y-3">
                           <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                              <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${(totals.total / MIN_ORDER) * 100}%` }} />
                           </div>
                           <p className="text-[9px] text-red-400 font-bold uppercase tracking-wider">Add ₹{(MIN_ORDER - totals.total).toLocaleString()} more to confirm</p>
                        </div>
                     ) : (
                        <div className="flex items-center gap-2 text-green-500 bg-green-500/10 py-2 px-3 rounded-xl border border-green-500/20">
                           <ShieldCheck size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Min. Order Reached</span>
                        </div>
                     )}
                  </div>
               </div>
            </aside>

            {/* MAIN CONTENT - PRODUCT GRID */}
            <div className="flex-1">
               <div className="flex items-center justify-between mb-10 px-2 lg:px-0">
                  <div className="flex flex-col">
                     <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Showing</span>
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-brand-purple italic tracking-tighter">{allProducts.length}</span>
                        <span className="text-sm font-bold text-gray-400">products</span>
                     </div>
                  </div>
                  
                  {/* SEARCH BAR */}
                  <div className="relative group hidden sm:block">
                     <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-magenta transition-colors" size={18} />
                     <input 
                        type="text" 
                        placeholder="Search crackers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border-2 border-gray-100 rounded-full py-4 pl-14 pr-8 text-sm font-bold focus:outline-none focus:border-brand-magenta/30 w-[300px] shadow-sm transition-all focus:shadow-xl focus:w-[400px]"
                     />
                  </div>
               </div>

               <motion.div 
                 layout
                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
               >
                  {allProducts.map((p) => (
                     <motion.div 
                        key={p.code}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -12 }}
                        className="bg-white rounded-[40px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col group relative"
                     >
                        {/* PRODUCT IMAGE SECTION */}
                        <div className="relative aspect-[4/4] overflow-hidden bg-gray-50">
                           {p.isPremium && (
                              <div className="absolute top-6 left-6 z-10 bg-brand-gold text-brand-purple px-4 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest shadow-xl border border-white/20">
                                 Premium
                              </div>
                           )}
                           <img 
                              src={p.image || FALLBACK_IMG} 
                              alt={p.name}
                              onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={() => updateQty(p.code, 1)}
                                className="bg-brand-magenta text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl scale-75 group-hover:scale-100 transition-all duration-500"
                              >
                                Quick Add
                              </button>
                           </div>
                        </div>

                        {/* PRODUCT INFO */}
                        <div className="p-8 flex-1 flex flex-col">
                           <div className="flex justify-between items-start mb-4">
                              <h4 className="text-xl font-black text-brand-purple uppercase tracking-tighter leading-tight drop-shadow-sm group-hover:text-brand-magenta transition-colors">{p.name}</h4>
                           </div>
                           
                           <div className="flex items-center gap-1 mb-6">
                              {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={12} className={i < (p.rating || 4) ? "text-brand-gold fill-brand-gold" : "text-gray-200 fill-gray-200"} />
                              ))}
                              <div className="ml-4 h-4 w-[1px] bg-gray-100 mx-2" />
                              <div className="flex items-center gap-1 text-green-500">
                                 <ShieldCheck size={14} />
                                 <span className="text-[10px] font-black uppercase tracking-widest leading-none">Safe & Quality</span>
                              </div>
                           </div>

                           <div className="mt-auto flex items-end justify-between pt-6 border-t border-gray-50">
                              <div className="flex flex-col">
                                 <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 leading-none">Starting from</span>
                                 <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-brand-purple tracking-tighter leading-none italic">₹{p.discountPrice}</span>
                                    <span className="text-xs text-brand-magenta/30 line-through font-bold">₹{p.mrp}</span>
                                 </div>
                              </div>
                              
                              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-1.5 border border-gray-100 shadow-inner group-hover:bg-brand-magenta group-hover:border-brand-magenta transition-all duration-500">
                                 {cart[p.code] ? (
                                    <div className="flex items-center gap-3">
                                       <button 
                                          onClick={() => updateQty(p.code, -1)}
                                          className="w-10 h-10 rounded-xl bg-white text-brand-purple flex items-center justify-center font-black shadow-md hover:scale-110 active:scale-90 transition-transform"
                                       > - </button>
                                       <span className="w-6 text-center font-black text-xs text-brand-purple group-hover:text-white">{cart[p.code]}</span>
                                       <button 
                                          onClick={() => updateQty(p.code, 1)}
                                          className="w-10 h-10 rounded-xl bg-white text-brand-magenta flex items-center justify-center font-black shadow-md hover:scale-110 active:scale-90 transition-transform"
                                       > + </button>
                                    </div>
                                 ) : (
                                    <button 
                                       onClick={() => updateQty(p.code, 1)}
                                       className="w-11 h-11 rounded-xl bg-brand-gold text-brand-purple flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                                    >
                                       <ShoppingCart size={22} fill="currentColor" />
                                    </button>
                                 )}
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
