import type { Metadata } from 'next';
import OrderSuccessPage from '@/shop/pages/OrderSuccessPage';

export const metadata: Metadata = { title: 'Order placed', robots: { index: false } };

export default function Page() {
  return <OrderSuccessPage />;
}
