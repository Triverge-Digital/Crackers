import { pricelist, Category, Product } from '../data/pricelist';
import { MIN_ORDER, PACKING_FEE_PCT } from '../constants';
import { slugify } from './format';

export type CatalogProduct = Product & { categoryId: number; categoryName: string; categorySlug: string };
export type CartMap = Record<string, number>;
export type CartLine = { product: CatalogProduct; qty: number; lineTotal: number; lineMrp: number };

export type CartTotals = {
  count: number;
  subtotal: number;
  mrpTotal: number;
  savings: number;
  packingFee: number;
  grandTotal: number;
  remaining: number;
  progress: number;
  meetsMinimum: boolean;
};

export const categorySlug = (cat: Pick<Category, 'name'>) => slugify(cat.name);

export const categories = pricelist.map(cat => ({ ...cat, slug: categorySlug(cat) }));

export const allProducts: CatalogProduct[] = pricelist.flatMap(cat =>
  cat.products.map(p => ({ ...p, categoryId: cat.id, categoryName: cat.name, categorySlug: categorySlug(cat) }))
);

const productByCode = new Map(allProducts.map(p => [p.code, p]));

export function findCategoryBySlug(slug?: string) {
  if (!slug) return undefined;
  return categories.find(c => c.slug === slug || String(c.id) === slug);
}

export function getProduct(code: string) {
  return productByCode.get(code);
}

/**
 * Only 29 SKUs have their own photograph; the rest reuse a photo of a similar
 * product. We show a photo only when the filename carries this product's code
 * so customers never see a picture of a different item.
 */
export function ownPhoto(p: Product): string | undefined {
  if (!p.image || p.showImage === false) return undefined;
  const stem = p.image.split('/').pop()?.replace(/(-sm)?\.\w+$/, '') ?? '';
  const codes = stem.replace(/^bw-/, '').split('-').filter(seg => /^\d+$/.test(seg));
  const code = p.code.replace(/^FP/i, '');
  return codes.includes(code) || stem.startsWith(`bw-${p.code.toLowerCase()}-`) ? p.image : undefined;
}

/** Small thumbnail variant generated alongside every product image. */
export function thumb(src: string): string {
  return src.replace(/\.webp$/, '-sm.webp');
}

/** Representative photo for a category card (first product with a real photo, else any). */
export function categoryImage(cat: Category): string | undefined {
  return cat.products.map(ownPhoto).find(Boolean) || cat.products.find(p => p.image)?.image;
}

export function cartLines(cart: CartMap): CartLine[] {
  const lines: CartLine[] = [];
  for (const p of allProducts) {
    const qty = cart[p.code];
    if (qty) lines.push({ product: p, qty, lineTotal: p.discountPrice * qty, lineMrp: p.mrp * qty });
  }
  return lines;
}

export function computeTotals(cart: CartMap): CartTotals {
  let count = 0, subtotal = 0, mrpTotal = 0;
  for (const line of cartLines(cart)) {
    count += line.qty;
    subtotal += line.lineTotal;
    mrpTotal += line.lineMrp;
  }
  const packingFee = Math.ceil(subtotal * PACKING_FEE_PCT);
  return {
    count,
    subtotal,
    mrpTotal,
    savings: mrpTotal - subtotal,
    packingFee,
    grandTotal: subtotal + packingFee,
    remaining: Math.max(MIN_ORDER - subtotal, 0),
    progress: Math.min((subtotal / MIN_ORDER) * 100, 100),
    meetsMinimum: subtotal >= MIN_ORDER,
  };
}

const SEARCH_ALIASES: Record<string, string[]> = {
  sparkler: ['pencil', 'sparklers'],
  bomb: ['atom', 'bomb', 'hydro', 'king'],
  'flower pot': ['flower pots', 'koti', 'fountain', 'pots'],
  chakkar: ['chakkar', 'wheel', 'spinner'],
  rocket: ['rocket', 'shot'],
  gift: ['family pack', 'combo'],
  box: ['family pack', 'combo'],
  kids: ['emu egg', 'cartoon', 'emoji', 'lolly', 'dora', 'butterfly', 'helicopter', 'bat ball'],
  wala: ['beats', 'wala'],
  garland: ['beats', 'wala'],
};

export function matchesSearch(p: CatalogProduct, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = `${p.name} ${p.categoryName} ${p.code}`.toLowerCase();
  if (haystack.includes(q)) return true;
  return Object.entries(SEARCH_ALIASES).some(([alias, terms]) => q.includes(alias) && terms.some(t => haystack.includes(t)));
}
