import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { pricelist, Product } from './data/pricelist';
import { POSTERS, FALLBACK_BRANDS, Brand } from './constants';
import Header from './components/Header';
import HomeView from './components/HomeView';
import StoreView from './components/StoreView';
import CartView from './components/CartView';
import WhatsAppButton from './components/WhatsAppButton';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPoster, setCurrentPoster] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | number>('all');
  const [sortBy, setSortBy] = useState('new');

  const allProducts = useMemo(() => {
    const flattened: (Product & { categoryId: number; categoryName: string })[] = [];
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

  const updateQty = (code: string, delta: number) => {
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

  // Brands are managed in the Medusa admin and fetched from the backend.
  // Falls back to the static list if the request fails.
  const [brands, setBrands] = useState<Brand[]>(FALLBACK_BRANDS);
  useEffect(() => {
    const backendUrl = (import.meta as any).env?.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const apiKey = (import.meta as any).env?.VITE_MEDUSA_PUBLISHABLE_KEY || '';
    fetch(`${backendUrl}/store/brands`, {
      headers: apiKey ? { 'x-publishable-api-key': apiKey } : {},
    })
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(data => {
        const list = (data?.brands || [])
          .filter((b: any) => b?.logo_url)
          .map((b: any) => ({ name: b.name, logo_url: b.logo_url }));
        if (list.length) setBrands(list);
      })
      .catch(() => { /* keep fallback brands */ });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF0F6] flex flex-col font-sans selection:bg-brand-magenta selection:text-white">
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        totals={totals}
      />

      <AnimatePresence mode="wait">
        {activeView === 'home' && (
          <HomeView
            setActiveView={setActiveView}
            currentPoster={currentPoster}
            setCurrentPoster={setCurrentPoster}
            setSelectedCategory={setSelectedCategory}
            brands={brands}
          />
        )}
        {activeView === 'order' && (
          <StoreView
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            allProducts={allProducts}
            totals={totals}
            cart={cart}
            updateQty={updateQty}
          />
        )}
        {activeView === 'cart' && (
          <CartView
            setActiveView={setActiveView}
            totals={totals}
            cart={cart}
            setCart={setCart}
            updateQty={updateQty}
          />
        )}
      </AnimatePresence>

      <WhatsAppButton />
    </div>
  );
}
