// Fixed storefront content. Anything the owner changes (minimum order, phone
// numbers, bank details, dispatch date…) lives in /admin/settings instead and
// is read through useShopConstants().

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://bwcrackers.com';
export const SITE_NAME = 'B&W Crackers';

// 2026 Diwali hero carousel. `desktop` is the full 1920x767 creative; `mobile`
// is a 3:2 crop of the left 60% so the headline stays legible on phones.
export const POSTERS = [
  { desktop: '/banner1.webp', mobile: '/banner1-mobile.webp', alt: 'Make Diwali brighter with B&W Crackers' },
  { desktop: '/banner2.webp', mobile: '/banner2-mobile.webp', alt: 'Light up happier moments with B&W Crackers' },
  { desktop: '/banner3.webp', mobile: '/banner3-mobile.webp', alt: '80% discount on all crackers' },
  { desktop: '/banner4.webp', mobile: '/banner4-mobile.webp', alt: 'Celebrate Diwali with B&W Crackers' },
];
export const HERO_INTERVAL_MS = 6000;

export type Brand = { name: string; logo_url: string };
export const FALLBACK_BRANDS: Brand[] = [
  { name: 'Anil', logo_url: '/brand1.png' },
  { name: 'Bheema', logo_url: '/brand2.png' },
  { name: 'Vanitha', logo_url: '/brand3.png' },
  { name: 'Sony', logo_url: '/brand4.png' },
  { name: 'Star Vell', logo_url: '/brand8.png' },
];

// Categories highlighted on the homepage "Shop by category" grid, by slug, in display order.
export const FEATURED_CATEGORY_SLUGS = [
  'diwali-special-combo-packs', 'one-sound-crackers', 'rockets', 'mega-colour-pencil',
  'deluxe-crackers', 'bijili-crackers', 'candles', 'night-crackling-effects', 'sparklers',
];

// Homepage "Collections" shortcuts — curated entry points into the store.
export const COLLECTIONS = [
  { title: 'Family Combo Packs', desc: 'Ready-made Diwali bundles', slug: 'diwali-special-combo-packs' },
  { title: 'Rockets & Sky Shots', desc: 'Spectacular aerial displays', slug: 'rockets' },
  { title: 'Sound Crackers', desc: 'Classic Sivakasi celebration sounds', slug: 'one-sound-crackers' },
  { title: 'Sparklers & Pencils', desc: 'Safe fun for the whole family', slug: 'mega-colour-pencil' },
];

export const STORAGE_KEYS = {
  cart: 'bw-cart-v1',
  customer: 'bw-customer-v1',
};
