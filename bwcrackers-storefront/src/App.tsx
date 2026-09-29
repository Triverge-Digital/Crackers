import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingOrderBar from './components/layout/FloatingOrderBar';
import WhatsAppButton from './components/layout/WhatsAppButton';
import CheckoutModal from './components/checkout/CheckoutModal';
import ScrollManager from './components/ui/ScrollManager';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import CollectionsPage from './pages/CollectionsPage';
import CartPage from './pages/CartPage';
import TrackOrderPage from './pages/TrackOrderPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <CartProvider>
      <ScrollManager />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-brand-navy focus:px-4 focus:py-2 focus:rounded-lg focus:font-black">
        Skip to content
      </a>
      <div className="min-h-screen bg-brand-cream flex flex-col font-sans selection:bg-brand-magenta selection:text-white">
        <Header />
        <main id="main" className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/:categorySlug" element={<StorePage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/track" element={<TrackOrderPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <FloatingOrderBar />
        <WhatsAppButton />
        <CheckoutModal />
      </div>
    </CartProvider>
  );
}
