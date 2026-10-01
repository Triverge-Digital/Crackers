// Shop settings edited in /admin/settings (stored as JSON in the `settings`
// table). Everything has a default so a partly filled row never breaks the site.

export type ShopSettings = {
  orderingEnabled: boolean;
  minOrder: number;
  packingFeePct: number; // percent, e.g. 2
  discountPct: number; // percent shown in copy, e.g. 80
  dispatchDeadline: string | null; // local ISO "2026-11-03T23:59" (IST); null hides the countdown
  announcement: string[];
  contact: {
    primaryPhone: string; // 10 digits
    secondaryPhone: string;
    whatsapp: string;
    email: string;
    instagram: string;
    address: string;
  };
  bank: { name: string; account: string; bank: string; branch: string; type: string; ifsc: string; upi: string };
  delivery: { dispatchWindow: string; transitTime: string };
  orderEmails: string[];
  /** Price list PDF uploaded in /admin/settings; null = the PDF bundled with the site. */
  priceList: { url: string; name: string; updatedAt: string } | null;
};

/** PDF shipped in /public, used until one is uploaded in the admin panel. */
export const BUNDLED_PRICE_LIST = '/BW-Crackers-Pricelist-2026.pdf';

export const DEFAULT_SETTINGS: ShopSettings = {
  orderingEnabled: true,
  minOrder: 3000,
  packingFeePct: 2,
  discountPct: 80,
  dispatchDeadline: '2026-11-03T23:59',
  announcement: ['Flat 80% discount on all crackers', 'Direct dispatch from Sivakasi', 'Minimum order ₹3,000', 'Pay after order confirmation · UPI & bank transfer'],
  contact: {
    primaryPhone: '9363036289',
    secondaryPhone: '7867036289',
    whatsapp: '9363036289',
    email: 'bwcrackers@gmail.com',
    instagram: 'https://www.instagram.com/bwcrackers/',
    address: 'Sivakasi, Virudhunagar District, Tamil Nadu',
  },
  bank: { name: 'WAHIDH HUSSAIN S', account: '003100050344099', bank: 'TamilNadu Mercantile Bank', branch: 'Sivakasi', type: 'Savings Account', ifsc: 'TMBL0000003', upi: '7867036289' },
  delivery: { dispatchWindow: '2–4 working days after payment confirmation', transitTime: '3–7 days depending on your city' },
  orderEmails: ['bwcrackers@gmail.com'],
  priceList: null,
};

/** Where the current price list PDF lives. Storage adds a download header for ?download=<name>. */
export const priceListFile = (s: ShopSettings) => (s.priceList ? `${s.priceList.url}?download=BW-Crackers-Price-List.pdf` : BUNDLED_PRICE_LIST);

/** Deep-merges a stored settings row over the defaults. */
export function normalizeSettings(raw: unknown): ShopSettings {
  const d = (raw && typeof raw === 'object' ? raw : {}) as Partial<ShopSettings>;
  return {
    ...DEFAULT_SETTINGS,
    ...d,
    contact: { ...DEFAULT_SETTINGS.contact, ...(d.contact ?? {}) },
    bank: { ...DEFAULT_SETTINGS.bank, ...(d.bank ?? {}) },
    delivery: { ...DEFAULT_SETTINGS.delivery, ...(d.delivery ?? {}) },
    announcement: Array.isArray(d.announcement) ? d.announcement : DEFAULT_SETTINGS.announcement,
    orderEmails: Array.isArray(d.orderEmails) ? d.orderEmails : DEFAULT_SETTINGS.orderEmails,
    priceList: d.priceList && typeof d.priceList.url === 'string' && d.priceList.url ? { url: d.priceList.url, name: String(d.priceList.name ?? 'Price list.pdf'), updatedAt: String(d.priceList.updatedAt ?? '') } : null,
    minOrder: Number(d.minOrder ?? DEFAULT_SETTINGS.minOrder),
    packingFeePct: Number(d.packingFeePct ?? DEFAULT_SETTINGS.packingFeePct),
    discountPct: Number(d.discountPct ?? DEFAULT_SETTINGS.discountPct),
  };
}

/** "9363036289" → "93630 36289" */
export const spacedPhone = (p: string) => (p.length === 10 ? `${p.slice(0, 5)} ${p.slice(5)}` : p);

/** Deadline stored as IST wall-clock time → absolute ISO string. */
export function deadlineIso(local: string | null): string | null {
  if (!local) return null;
  return /[+-]\d\d:\d\d$|Z$/.test(local) ? local : `${local.length === 16 ? `${local}:59` : local}+05:30`;
}

/**
 * The storefront's constant names, derived from live settings. Components use
 * these exactly as they used the old hard-coded constants.
 */
export function shopConstants(s: ShopSettings) {
  const primaryIntl = `91${s.contact.primaryPhone}`;
  const whatsappIntl = `91${s.contact.whatsapp || s.contact.primaryPhone}`;
  const DELIVERY_INFO = {
    dispatchWindow: s.delivery.dispatchWindow,
    transitTime: s.delivery.transitTime,
    coverage: 'We ship by road across India. Share your city when you order and we will confirm dispatch and collection on WhatsApp.',
    restrictions: 'Crackers travel only by road via registered parcel services. Transport charges are paid by the customer directly to the parcel office on delivery and depend on distance and box count.',
    packing: `Every order is packed in sealed cartons with a ${s.packingFeePct}% packing charge already included in your total.`,
  };
  return {
    ORDERING_ENABLED: s.orderingEnabled,
    MIN_ORDER: s.minOrder,
    PACKING_FEE_PCT: s.packingFeePct / 100,
    DISCOUNT_PCT: s.discountPct,
    DISPATCH_DEADLINE: deadlineIso(s.dispatchDeadline),
    ANNOUNCEMENT: s.announcement,
    CONTACT: {
      primaryPhone: spacedPhone(s.contact.primaryPhone),
      secondaryPhone: spacedPhone(s.contact.secondaryPhone),
      email: s.contact.email,
      instagram: s.contact.instagram,
      address: s.contact.address,
    },
    PRIMARY_PHONE_INTL: primaryIntl,
    SECONDARY_PHONE_INTL: `91${s.contact.secondaryPhone}`,
    WHATSAPP_INTL: whatsappIntl,
    WHATSAPP_LINK: `https://wa.me/${whatsappIntl}?text=${encodeURIComponent("Hi B&W Crackers, I'd like to know more about your products.")}`,
    BANK: { ...s.bank, qrImage: '/gpay-qr.webp' },
    // Fixed address: /price-list.pdf looks up the current file on every click (see app/price-list.pdf).
    PRICE_LIST_URL: '/price-list.pdf',
    DELIVERY_INFO,
    FAQS: buildFaqs(s, DELIVERY_INFO),
  };
}

export type ShopConstants = ReturnType<typeof shopConstants>;

function buildFaqs(s: ShopSettings, delivery: { dispatchWindow: string; transitTime: string }) {
  return [
    { q: 'What is the minimum order value?', a: `The minimum order is ₹${s.minOrder.toLocaleString('en-IN')} (after discount). This keeps parcel transport economical for you — crackers are shipped by road in sealed cartons.` },
    { q: `Is the ${s.discountPct}% discount really applied on every item?`, a: 'Yes. Every price on this site is already the discounted price. The struck-through amount next to it is the printed MRP so you can see the saving on each item.' },
    { q: 'How do I place an order?', a: 'Tap + on the items you want, then tap "Place order". Enter your name, mobile number and delivery address. We receive your order instantly and call or WhatsApp you to confirm it.' },
    { q: 'How do I pay?', a: 'After we confirm your order, pay by UPI (GPay / PhonePe) or bank transfer using the details in the "How to pay" section, then share the payment screenshot with your order reference.' },
    { q: 'Where do you deliver and how long does it take?', a: `We dispatch from Sivakasi within ${delivery.dispatchWindow}. Transit typically takes ${delivery.transitTime}. Transport charges are paid at the parcel office on collection.` },
    { q: 'Can I track my order?', a: 'Yes. Use the "Track order" page with your order reference and mobile number to see the current status — confirmed, packed, dispatched or delivered.' },
    { q: 'What if something arrives damaged or missing?', a: 'Please record an unboxing video when you open the parcel. Claims for damaged or missing items are accepted only with an unboxing video, sent to us on WhatsApp within 24 hours of delivery.' },
  ];
}
