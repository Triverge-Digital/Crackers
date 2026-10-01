import type { Metadata } from 'next';
import { Suspense } from 'react';
import TrackOrderPage from '@/shop/pages/TrackOrderPage';

export const metadata: Metadata = { title: 'Track your order', description: 'Check the status of your B&W Crackers order with your order reference and mobile number.' };

export default function Page() {
  return (
    <Suspense>
      <TrackOrderPage />
    </Suspense>
  );
}
