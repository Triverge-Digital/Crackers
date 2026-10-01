import type { Metadata } from 'next';
import CartPage from '@/shop/pages/CartPage';

export const metadata: Metadata = { title: 'Your order', robots: { index: false } };

export default function Page() {
  return <CartPage />;
}
