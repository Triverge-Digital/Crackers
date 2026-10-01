'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { Catalog, CartMap, computeCartLines, computeCartTotals } from '@/lib/catalog';
import { ShopSettings, shopConstants, ShopConstants } from '@/lib/settings';
import { setRuntimeConstants } from '../lib/runtime';

type ShopValue = {
  catalog: Catalog;
  settings: ShopSettings;
  C: ShopConstants;
};

const ShopContext = createContext<ShopValue | null>(null);

/** Live catalog + settings from Supabase, handed down from the shop layout (server). */
export function ShopProvider({ catalog, settings, children }: { catalog: Catalog; settings: ShopSettings; children: React.ReactNode }) {
  const value = useMemo(() => ({ catalog, settings, C: shopConstants(settings) }), [catalog, settings]);
  // Plain modules (PDF, WhatsApp text) read settings through the runtime registry.
  setRuntimeConstants(value.C);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

function useShop(): ShopValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>');
  return ctx;
}

/** Shop settings under the storefront's historical constant names (MIN_ORDER, CONTACT, BANK…). */
export function useShopConstants(): ShopConstants {
  return useShop().C;
}

/** Catalog lookups bound to the live catalog, named like the old static helpers. */
export function useCatalog() {
  const { catalog, C } = useShop();
  return useMemo(() => {
    const byCode = new Map(catalog.products.map(p => [p.code, p]));
    const cartLines = (cart: CartMap) => computeCartLines(catalog.products, cart);
    return {
      categories: catalog.categories,
      allProducts: catalog.products,
      getProduct: (code: string) => byCode.get(code),
      findCategoryBySlug: (slug?: string) =>
        slug ? catalog.categories.find(c => c.slug === slug || String(c.id) === slug) : undefined,
      cartLines,
      computeTotals: (cart: CartMap) => computeCartTotals(cartLines(cart), C.MIN_ORDER, C.PACKING_FEE_PCT),
    };
  }, [catalog, C]);
}
