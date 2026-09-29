// Shared constants for the storefront. Anything a shop owner is likely to
// change between seasons lives here so no component needs editing.

export const SITE_URL = 'https://bwcrackers.com';
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

// Fallback brand logos (used only if the backend /store/brands request fails).
export const FALLBACK_BRANDS = [
  { name: 'Anil', logo_url: '/brand1.png' },
  { name: 'Bheema', logo_url: '/brand2.png' },
  { name: 'Vanitha', logo_url: '/brand3.png' },
  { name: 'Sony', logo_url: '/brand4.png' },
  { name: 'Star Vell', logo_url: '/brand8.png' },
];

export const MIN_ORDER = 3000;
export const PACKING_FEE_PCT = 0.02;
export const DISCOUNT_PCT = 80;

// Last date we can guarantee dispatch before Diwali 2026 (8 Nov 2026).
// Shown as a countdown; set to null to hide the countdown entirely.
export const DISPATCH_DEADLINE: string | null = '2026-11-03T23:59:59+05:30';

// Contact details (footer, WhatsApp button, tel: links).
export const CONTACT = {
  primaryPhone: '93630 36289',
  secondaryPhone: '78670 36289',
  email: 'bwcrackers@gmail.com',
  instagram: 'https://www.instagram.com/bwcrackers/',
  address: 'Sivakasi, Virudhunagar District, Tamil Nadu',
};
// E.164 (no spaces / +) for wa.me + tel: links — India country code 91.
export const PRIMARY_PHONE_INTL = '919363036289';
export const SECONDARY_PHONE_INTL = '917867036289';
export const WHATSAPP_LINK = `https://wa.me/${PRIMARY_PHONE_INTL}?text=${encodeURIComponent(
  "Hi B&W Crackers, I'd like to know more about your products."
)}`;

// Bank / UPI details shown on the payment step, the How-to-Pay section and
// the estimate PDF.
export const BANK = {
  name: 'WAHIDH HUSSAIN S',
  account: '003100050344099',
  branch: 'Sivakasi',
  type: 'Savings Account',
  ifsc: 'TMBL0000003',
  bank: 'TamilNadu Mercantile Bank',
  upi: '7867036289',
  qrImage: '/gpay-qr.webp',
};

export type Brand = { name: string; logo_url: string };

// Category header colours, shared everywhere a category is rendered so the
// same category never shows a different colour on a different page.
export const CATEGORY_COLORS: Record<number, string> = {
  1: 'bg-red-600', 2: 'bg-blue-600', 3: 'bg-green-600', 4: 'bg-purple-600',
  5: 'bg-orange-500', 6: 'bg-pink-600', 7: 'bg-indigo-600', 8: 'bg-yellow-600',
  9: 'bg-amber-600', 10: 'bg-teal-600', 11: 'bg-rose-600', 12: 'bg-red-700',
  13: 'bg-cyan-600', 14: 'bg-violet-600', 15: 'bg-sky-600', 16: 'bg-orange-700',
  17: 'bg-lime-600', 18: 'bg-fuchsia-600', 19: 'bg-blue-700', 20: 'bg-emerald-600',
  21: 'bg-stone-600', 22: 'bg-pink-700', 23: 'bg-yellow-700', 24: 'bg-yellow-500',
  25: 'bg-stone-700', 26: 'bg-purple-700', 27: 'bg-fuchsia-700',
};

// Hex twins of CATEGORY_COLORS for inline glows / gradients on poster cards.
export const CATEGORY_HEX: Record<number, string> = {
  1: '#dc2626', 2: '#2563eb', 3: '#16a34a', 4: '#9333ea', 5: '#f97316', 6: '#db2777',
  7: '#4f46e5', 8: '#ca8a04', 9: '#d97706', 10: '#0d9488', 11: '#e11d48', 12: '#b91c1c',
  13: '#0891b2', 14: '#7c3aed', 15: '#0284c7', 16: '#c2410c', 17: '#65a30d', 18: '#c026d3',
  19: '#1d4ed8', 20: '#059669', 21: '#57534e', 22: '#be185d', 23: '#a16207', 24: '#eab308',
  25: '#44403c', 26: '#7e22ce', 27: '#a21caf',
};

// Categories highlighted on the homepage "Our Products" grid, in display order.
export const FEATURED_CATEGORY_IDS = [27, 1, 4, 6, 2, 3, 5, 7, 24];

// Homepage "Collections" shortcuts — curated entry points into the store.
export const COLLECTIONS = [
  { title: 'Family Combo Packs', desc: 'Ready-made Diwali bundles from ₹3,500', categoryId: 27 },
  { title: 'Rockets & Sky Shots', desc: 'Spectacular aerial displays', categoryId: 4 },
  { title: 'Sound Crackers', desc: 'Classic Sivakasi celebration sounds', categoryId: 1 },
  { title: 'Sparklers & Pencils', desc: 'Safe fun for the whole family', categoryId: 6 },
];

export const DELIVERY_INFO = {
  dispatchWindow: '2–4 working days after payment confirmation',
  transitTime: '3–7 days depending on your city',
  coverage: 'We ship by road across India. Share your city when you order and we will confirm dispatch and collection on WhatsApp.',
  restrictions: 'Crackers travel only by road via registered parcel services. Transport charges are paid by the customer directly to the parcel office on delivery and depend on distance and box count.',
  packing: `Every order is packed in sealed cartons with a ${PACKING_FEE_PCT * 100}% packing charge already included in your total.`,
};

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'What is the minimum order value?',
    a: `The minimum order is ₹${MIN_ORDER.toLocaleString('en-IN')} (after discount). This keeps parcel transport economical for you — crackers are shipped by road in sealed cartons.`,
  },
  {
    q: 'Is the 80% discount really applied on every item?',
    a: 'Yes. Every price on this site is already the discounted price. The struck-through amount next to it is the printed MRP so you can see the saving on each item.',
  },
  {
    q: 'How do I place an order?',
    a: 'Tap + on the items you want, then tap "Place Order". Enter your name, mobile number and delivery address. We receive your order instantly and confirm it with you on WhatsApp.',
  },
  {
    q: 'How do I pay?',
    a: 'After we confirm your order on WhatsApp, pay by UPI (GPay / PhonePe) or bank transfer using the details in the "How to Pay" section, then share the payment screenshot with your order reference.',
  },
  {
    q: 'Where do you deliver and how long does it take?',
    a: `We dispatch from Sivakasi within ${DELIVERY_INFO.dispatchWindow}. Transit typically takes ${DELIVERY_INFO.transitTime}. Transport charges are paid at the parcel office on collection.`,
  },
  {
    q: 'Can I track my order?',
    a: 'Yes. Use the "Track Order" page with your order reference and mobile number to see the current status — confirmed, packed, dispatched or delivered.',
  },
  {
    q: 'What if something arrives damaged or missing?',
    a: 'Please record an unboxing video when you open the parcel. Claims for damaged or missing items are accepted only with an unboxing video, sent to us on WhatsApp within 24 hours of delivery.',
  },
];

export const STORAGE_KEYS = {
  cart: 'bw-cart-v1',
  customer: 'bw-customer-v1',
};
