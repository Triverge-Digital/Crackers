import type { Metadata } from 'next';
import { Suspense } from 'react';
import StorePage from '@/shop/pages/StorePage';

export const metadata: Metadata = {
  title: 'Store – 2026 price list',
  description: 'Browse the full B&W Crackers 2026 price list. Every price is 80% off MRP. Order online, pay after confirmation.',
  alternates: { canonical: '/store' },
};

export default function Page() {
  return (
    <Suspense>
      <StorePage />
    </Suspense>
  );
}
