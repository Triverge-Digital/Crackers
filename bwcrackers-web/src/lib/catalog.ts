// Catalog shapes and pure helpers shared by the storefront, the order API and
// the admin panel. Data comes from Supabase (see catalog-server.ts).

export type DbCategory = { id: number; name: string; slug: string; sort_order: number; is_active: boolean };
export type DbProduct = {
  id: number;
  code: string;
  name: string;
  category_id: number;
  unit: string;
  mrp: number;
  price: number;
  image_url: string | null;
  gallery: string[];
  description: string | null;
  is_active: boolean;
  in_stock: boolean;
  is_premium: boolean;
  sort_order: number;
};

export type CatalogProduct = {
  id: number;
  code: string;
  name: string;
  unit: string;
  mrp: number;
  discountPrice: number;
  image?: string;
  gallery: string[];
  isPremium: boolean;
  inStock: boolean;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
};

export type Category = { id: number; name: string; slug: string; products: CatalogProduct[] };
export type Catalog = { categories: Category[]; products: CatalogProduct[] };

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

/** Builds the storefront catalog from active rows, in admin sort order. Empty categories are dropped. */
export function buildCatalog(cats: DbCategory[], rows: DbProduct[]): Catalog {
  const sortedCats = [...cats].filter(c => c.is_active).sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
  const categories: Category[] = sortedCats.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    products: rows
      .filter(p => p.category_id === c.id && p.is_active)
      .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
      .map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        unit: p.unit,
        mrp: Number(p.mrp),
        discountPrice: Number(p.price),
        image: p.image_url ?? undefined,
        gallery: p.gallery ?? [],
        isPremium: p.is_premium,
        inStock: p.in_stock,
        categoryId: c.id,
        categoryName: c.name,
        categorySlug: c.slug,
      })),
  })).filter(c => c.products.length > 0);
  return { categories, products: categories.flatMap(c => c.products) };
}

export function computeCartLines(products: CatalogProduct[], cart: CartMap): CartLine[] {
  const lines: CartLine[] = [];
  for (const p of products) {
    const qty = cart[p.code];
    if (qty) lines.push({ product: p, qty, lineTotal: p.discountPrice * qty, lineMrp: p.mrp * qty });
  }
  return lines;
}

export function computeCartTotals(lines: CartLine[], minOrder: number, packingFeeFraction: number): CartTotals {
  let count = 0, subtotal = 0, mrpTotal = 0;
  for (const line of lines) {
    count += line.qty;
    subtotal += line.lineTotal;
    mrpTotal += line.lineMrp;
  }
  const packingFee = Math.ceil(subtotal * packingFeeFraction);
  return {
    count,
    subtotal,
    mrpTotal,
    savings: mrpTotal - subtotal,
    packingFee,
    grandTotal: subtotal + packingFee,
    remaining: Math.max(minOrder - subtotal, 0),
    progress: minOrder > 0 ? Math.min((subtotal / minOrder) * 100, 100) : 100,
    meetsMinimum: subtotal >= minOrder,
  };
}

/** Every product photo is stored with a 240px "-sm" twin. */
export function thumb(src: string): string {
  return src.replace(/\.webp$/, '-sm.webp');
}

/** With the Supabase catalog every image belongs to its own product. */
export function ownPhoto(p: Pick<CatalogProduct, 'image'>): string | undefined {
  return p.image;
}

export function categoryImage(cat: Pick<Category, 'products'>): string | undefined {
  return cat.products.find(p => p.image)?.image;
}

const SEARCH_ALIASES: Record<string, string[]> = {
  sparkler: ['pencil', 'sparklers'],
  bomb: ['atom', 'bomb', 'hydro', 'king'],
  'flower pot': ['flower pots', 'koti', 'fountain', 'pots'],
  chakkar: ['chakkar', 'wheel', 'spinner'],
  rocket: ['rocket', 'shot'],
  gift: ['gift box', 'family pack', 'combo'],
  box: ['gift box', 'family pack', 'combo'],
  kids: ['emu egg', 'cartoon', 'emoji', 'lolly', 'dora', 'butterfly', 'helicopter', 'bat ball', 'serpent'],
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

// Stable accent colour per category, used for thumbnails and card accents.
const ACCENTS = ['#dc2626', '#2563eb', '#16a34a', '#9333ea', '#f97316', '#db2777', '#4f46e5', '#ca8a04', '#d97706', '#0d9488', '#e11d48', '#0891b2', '#7c3aed', '#0284c7', '#c2410c', '#65a30d', '#c026d3', '#059669'];
export const categoryAccent = (id: number) => ACCENTS[Math.abs(id) % ACCENTS.length];
