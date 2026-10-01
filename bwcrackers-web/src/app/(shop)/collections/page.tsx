import type { Metadata } from 'next';
import CollectionsPage from '@/shop/pages/CollectionsPage';

export const metadata: Metadata = {
  title: 'All categories',
  description: 'Browse every category of Sivakasi crackers at 80% off MRP — sound crackers, rockets, sparklers, flower pots, fancy shots, gift boxes and Diwali combo packs.',
  alternates: { canonical: '/collections' },
};

export default function Page() {
  return <CollectionsPage />;
}
