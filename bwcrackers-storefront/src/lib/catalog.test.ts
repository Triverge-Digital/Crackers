import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pricelist } from '../data/pricelist';
import { allProducts, categories, computeTotals, matchesSearch, ownPhoto, thumb, findCategoryBySlug } from './catalog';
import { MIN_ORDER, PACKING_FEE_PCT, CATEGORY_COLORS, CATEGORY_HEX, FEATURED_CATEGORY_IDS, COLLECTIONS } from '../constants';
import { formatINR, slugify } from './format';

const PUBLIC = resolve(__dirname, '../../public');

describe('2026 price list data', () => {
  it('has 27 categories and 165 products', () => {
    expect(pricelist).toHaveLength(27);
    expect(allProducts).toHaveLength(165);
  });

  it('applies exactly 80% discount on MRP to every product', () => {
    // Code 142 (6" Water Quin) is printed as MRP 1250 / price 180 in the
    // official 2026 PDF itself; we honour the printed selling price.
    const printedExceptions = new Set(['142']);
    for (const p of allProducts) {
      if (printedExceptions.has(p.code)) continue;
      expect(p.discountPrice, `${p.code} ${p.name}`).toBe(Math.round(p.mrp * 0.2));
      expect(p.discountPrice).toBeGreaterThan(0);
    }
  });

  it('uses unique product codes and category slugs', () => {
    const codes = allProducts.map(p => p.code);
    expect(new Set(codes).size).toBe(codes.length);
    const slugs = categories.map(c => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it('references only images that exist (full + thumbnail)', () => {
    for (const p of allProducts) {
      if (!p.image) continue;
      expect(existsSync(resolve(PUBLIC, `.${p.image}`)), p.image).toBe(true);
      expect(existsSync(resolve(PUBLIC, `.${thumb(p.image)}`)), thumb(p.image)).toBe(true);
    }
  });

  it('has a colour for every category and valid featured/collection ids', () => {
    for (const c of categories) {
      expect(CATEGORY_COLORS[c.id], c.name).toBeDefined();
      expect(CATEGORY_HEX[c.id], c.name).toMatch(/^#[0-9a-f]{6}$/i);
    }
    for (const id of FEATURED_CATEGORY_IDS) expect(categories.some(c => c.id === id), `featured ${id}`).toBe(true);
    for (const col of COLLECTIONS) expect(categories.some(c => c.id === col.categoryId), col.title).toBe(true);
  });

  it('only shows a photo when the filename carries the product code', () => {
    const kuruvi = allProducts.find(p => p.code === '1')!;
    const chorsa = allProducts.find(p => p.code === '9')!;
    expect(ownPhoto(kuruvi)).toBe(kuruvi.image);
    expect(ownPhoto(chorsa)).toBeUndefined();
  });
});

describe('cart totals', () => {
  it('computes packing fee, savings and minimum-order state', () => {
    const p = allProducts.find(x => x.code === '14')!; // 100 wala deluxe, ₹300
    const totals = computeTotals({ [p.code]: 10 });
    expect(totals.subtotal).toBe(3000);
    expect(totals.count).toBe(10);
    expect(totals.packingFee).toBe(Math.ceil(3000 * PACKING_FEE_PCT));
    expect(totals.grandTotal).toBe(3060);
    expect(totals.savings).toBe(p.mrp * 10 - 3000);
    expect(totals.meetsMinimum).toBe(true);
    expect(totals.remaining).toBe(0);
  });

  it('reports the remaining amount below the minimum', () => {
    const totals = computeTotals({ '1': 1 });
    expect(totals.meetsMinimum).toBe(false);
    expect(totals.remaining).toBe(MIN_ORDER - 9);
    expect(computeTotals({}).progress).toBe(0);
  });
});

describe('search and routing helpers', () => {
  it('matches by name, category, code and aliases', () => {
    const rocket = allProducts.find(p => p.code === '17')!;
    expect(matchesSearch(rocket, 'baby')).toBe(true);
    expect(matchesSearch(rocket, 'ROCKETS')).toBe(true);
    expect(matchesSearch(rocket, '17')).toBe(true);
    const pencil = allProducts.find(p => p.code === '22')!;
    expect(matchesSearch(pencil, 'sparkler')).toBe(true);
    expect(matchesSearch(pencil, 'bomb')).toBe(false);
  });

  it('resolves category slugs and ids', () => {
    expect(findCategoryBySlug('rockets')?.id).toBe(4);
    expect(findCategoryBySlug('4')?.id).toBe(4);
    expect(findCategoryBySlug('nope')).toBeUndefined();
    expect(slugify('DIWALI SPECIAL COMBO PACKS')).toBe('diwali-special-combo-packs');
  });

  it('formats rupees with Indian grouping', () => {
    expect(formatINR(3000)).toBe('₹3,000');
    expect(formatINR(150000)).toBe('₹1,50,000');
    expect(formatINR(9.6)).toBe('₹10');
  });
});
