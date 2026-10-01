import { CartLine } from '@/lib/catalog';

// Browser → this site's own API routes (app/api/*), which talk to Supabase.

export type CustomerDetails = {
  name: string;
  phone: string; // 10 digits, no country code
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

/** Thrown when the server rejects an order; `status` < 500 means the customer can fix it. */
export class OrderError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export type PlacedOrderResult = {
  reference: string;
  subtotal: number;
  packing_fee: number;
  grand_total: number;
};

/** Places an order. Prices are recalculated on the server from the live catalog. */
export async function createOrder(lines: CartLine[], customer: CustomerDetails, signal?: AbortSignal): Promise<PlacedOrderResult> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email.trim() || undefined,
        address: customer.address.trim(),
        city: customer.city.trim() || undefined,
        state: customer.state.trim() || undefined,
        pincode: customer.pincode.trim() || undefined,
        notes: customer.notes.trim() || undefined,
      },
      items: lines.map(l => ({ code: l.product.code, quantity: l.qty })),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new OrderError(data?.message || `Order could not be placed (${res.status})`, res.status);
  return data as PlacedOrderResult;
}

export type TrackedOrder = {
  reference: string;
  status: string;
  customer_name: string;
  created_at: string;
  updated_at: string;
  items: { title: string; quantity: number; unit_price: number }[];
  subtotal: number;
  packing_fee: number;
  grand_total: number;
  tracking_number: string | null;
  transporter: string | null;
};

export async function trackOrder(reference: string, phone: string): Promise<TrackedOrder> {
  const params = new URLSearchParams({ ref: reference.replace(/^#/, '').trim(), phone: phone.trim() });
  const res = await fetch(`/api/track?${params}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Order not found');
  return data.order as TrackedOrder;
}
