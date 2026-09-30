import { CartLine, CartMap, cartLines } from './catalog';

/** Snapshot of the order just placed, kept for the thank-you page (survives a refresh in the same tab). */
export type PlacedOrder = {
  reference: string;
  placedAt: string;
  /** 'saved' = stored on our backend; 'whatsapp' = backend unreachable, sent as a WhatsApp message instead. */
  channel: 'saved' | 'whatsapp';
  whatsappUrl?: string;
  customer: { name: string; phone: string; email: string; address: string };
  items: CartMap;
  subtotal: number;
  packingFee: number;
  grandTotal: number;
  savings: number;
  /** Set once the confirmation email has been sent, so a refresh doesn't send it again. */
  emailSent?: boolean;
};

const KEY = 'bw-last-order-v1';

export function saveLastOrder(order: PlacedOrder): void {
  try { window.sessionStorage.setItem(KEY, JSON.stringify(order)); } catch { /* private mode */ }
}

export function loadLastOrder(): PlacedOrder | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder) : null;
  } catch {
    return null;
  }
}

export function orderLines(order: PlacedOrder): CartLine[] {
  return cartLines(order.items);
}
