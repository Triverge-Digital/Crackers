import { getShopData } from '@/lib/shop-data';
import { ShopProvider } from '../context/ShopContext';
import { CartProvider } from '../context/CartContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FloatingOrderBar from '../components/layout/FloatingOrderBar';
import WhatsAppButton from '../components/layout/WhatsAppButton';
import CheckoutModal from '../components/checkout/CheckoutModal';
import ScrollManager from '../components/ui/ScrollManager';

/** Storefront chrome around every shop page, fed by the live catalog and settings. */
export default async function ShopShell({ children }: { children: React.ReactNode }) {
  const { catalog, settings } = await getShopData();
  return (
    <ShopProvider catalog={catalog} settings={settings}>
      <CartProvider>
        <ScrollManager />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-brand-navy focus:px-4 focus:py-2 focus:rounded-lg focus:font-black">
          Skip to content
        </a>
        <div className="min-h-screen bg-brand-cream flex flex-col font-sans selection:bg-brand-magenta selection:text-white">
          <Header />
          <main id="main" className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <FloatingOrderBar />
          <WhatsAppButton />
          <CheckoutModal />
        </div>
      </CartProvider>
    </ShopProvider>
  );
}
