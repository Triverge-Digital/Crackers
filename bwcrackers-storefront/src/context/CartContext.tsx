import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../constants';
import { CartMap, CartLine, CartTotals, cartLines, computeTotals, getProduct } from '../lib/catalog';
import { CustomerDetails } from '../lib/api';

type CartContextValue = {
  cart: CartMap;
  lines: CartLine[];
  totals: CartTotals;
  updateQty: (code: string, delta: number) => void;
  setQty: (code: string, qty: number) => void;
  removeItem: (code: string) => void;
  clearCart: () => void;
  customer: CustomerDetails;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerDetails>>;
  checkoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  lastAdded: string | null;
};

const EMPTY_CUSTOMER: CustomerDetails = { name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', notes: '' };

const CartContext = createContext<CartContextValue | null>(null);

type CartActions = Pick<CartContextValue, 'updateQty' | 'setQty'>;
// Stable across cart changes, so rows that only need the setters don't re-render on every add.
const CartActionsContext = createContext<CartActions | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function sanitizeCart(raw: CartMap): CartMap {
  // Drop SKUs that no longer exist in the price list (e.g. after a catalog update).
  const clean: CartMap = {};
  for (const [code, qty] of Object.entries(raw)) {
    if (getProduct(code) && Number.isFinite(qty) && qty > 0) clean[code] = Math.min(Math.floor(qty), 999);
  }
  return clean;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartMap>(() => sanitizeCart(readStorage<CartMap>(STORAGE_KEYS.cart, {})));
  const [customer, setCustomer] = useState<CustomerDetails>(() => readStorage(STORAGE_KEYS.customer, EMPTY_CUSTOMER));
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart)); } catch { /* storage full / private mode */ }
  }, [cart]);

  useEffect(() => {
    // Never persist free-text notes; they are order-specific.
    const { notes: _notes, ...persisted } = customer;
    try { window.localStorage.setItem(STORAGE_KEYS.customer, JSON.stringify(persisted)); } catch { /* ignore */ }
  }, [customer]);

  useEffect(() => {
    if (!lastAdded) return;
    const t = window.setTimeout(() => setLastAdded(null), 1800);
    return () => window.clearTimeout(t);
  }, [lastAdded]);

  const setQty = useCallback((code: string, qty: number) => {
    setCart(prev => {
      const next = Math.max(0, Math.min(999, Math.floor(qty)));
      if (next === 0) {
        const { [code]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [code]: next };
    });
  }, []);

  const updateQty = useCallback((code: string, delta: number) => {
    setCart(prev => {
      const next = Math.max(0, Math.min(999, (prev[code] || 0) + delta));
      if (next === 0) {
        const { [code]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [code]: next };
    });
    if (delta > 0) setLastAdded(code);
  }, []);

  const removeItem = useCallback((code: string) => setQty(code, 0), [setQty]);
  const clearCart = useCallback(() => setCart({}), []);

  const lines = useMemo(() => cartLines(cart), [cart]);
  const totals = useMemo(() => computeTotals(cart), [cart]);

  const value = useMemo<CartContextValue>(() => ({
    cart, lines, totals, updateQty, setQty, removeItem, clearCart,
    customer, setCustomer,
    checkoutOpen,
    openCheckout: () => setCheckoutOpen(true),
    closeCheckout: () => setCheckoutOpen(false),
    lastAdded,
  }), [cart, lines, totals, updateQty, setQty, removeItem, clearCart, customer, checkoutOpen, lastAdded]);

  const actions = useMemo<CartActions>(() => ({ updateQty, setQty }), [updateQty, setQty]);

  return (
    <CartActionsContext.Provider value={actions}>
      <CartContext.Provider value={value}>{children}</CartContext.Provider>
    </CartActionsContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

export function useCartActions(): CartActions {
  const ctx = useContext(CartActionsContext);
  if (!ctx) throw new Error('useCartActions must be used inside <CartProvider>');
  return ctx;
}
