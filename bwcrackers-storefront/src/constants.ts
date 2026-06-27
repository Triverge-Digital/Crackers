// Shared constants for the storefront.

export const POSTERS = [
  "/banner1.webp",
  "/banner2.webp",
  "/banner3.webp",
  "/banner4.webp"
];

// Fallback brand logos (used only if the backend /store/brands request fails).
// Live list is fetched from the Medusa backend and managed in the admin.
export const FALLBACK_BRANDS = [
  { name: "Anil", logo_url: "/brand1.png" },
  { name: "Bheema", logo_url: "/brand2.png" },
  { name: "Vanitha", logo_url: "/brand3.png" },
  { name: "Sony", logo_url: "/brand4.png" },
  { name: "Star Vell", logo_url: "/brand8.png" }
];

export const FALLBACK_IMG = "https://images.unsplash.com/photo-1549413243-982c7f5c22f6?auto=format&fit=crop&q=80&w=1200";

export const MIN_ORDER = 3000;

// Contact details (shown in footer + WhatsApp button).
export const CONTACT = {
  primaryPhone: "93630 36289",
  secondaryPhone: "78670 36289",
  email: "bwcrackers@gmail.com",
};
// E.164 (no spaces / +) for wa.me + tel: links — India country code 91.
export const PRIMARY_PHONE_INTL = "919363036289";
export const WHATSAPP_LINK = `https://wa.me/${PRIMARY_PHONE_INTL}?text=${encodeURIComponent(
  "Hi BW Crackers, I'd like to know more about your products."
)}`;

export type Totals = { total: number; count: number };
export type Brand = { name: string; logo_url: string };
