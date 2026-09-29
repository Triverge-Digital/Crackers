import { Brand, FALLBACK_BRANDS } from '../constants';
import { CartLine } from './catalog';

const env = (import.meta as any).env ?? {};
// In production the backend URL must be configured explicitly; only dev falls
// back to the local Medusa server.
export const BACKEND_URL: string = env.VITE_MEDUSA_BACKEND_URL || (env.DEV ? 'http://localhost:9000' : '');
const PUBLISHABLE_KEY: string = env.VITE_MEDUSA_PUBLISHABLE_KEY || '';

if (!BACKEND_URL && !env.DEV) {
  console.warn('[bw] VITE_MEDUSA_BACKEND_URL is not set — orders will only be sent via WhatsApp.');
}

function headers(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (PUBLISHABLE_KEY) h['x-publishable-api-key'] = PUBLISHABLE_KEY;
  return h;
}

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

export type EnquiryResult = {
  id: string;
  reference: string;
  status: string;
  subtotal: number;
  packing_fee: number;
  grand_total: number;
};

export async function createOrderEnquiry(lines: CartLine[], customer: CustomerDetails, signal?: AbortSignal): Promise<EnquiryResult> {
  if (!BACKEND_URL) throw new Error('Backend not configured');
  const res = await fetch(`${BACKEND_URL}/store/order-enquiry`, {
    method: 'POST',
    headers: headers(),
    signal,
    body: JSON.stringify({
      customer_name: customer.name.trim(),
      phone: `+91${customer.phone.trim()}`,
      email: customer.email.trim() || undefined,
      address: customer.address.trim(),
      city: customer.city.trim() || undefined,
      state: customer.state.trim() || undefined,
      pincode: customer.pincode.trim() || undefined,
      notes: customer.notes.trim() || undefined,
      items: lines.map(l => ({ code: l.product.code, quantity: l.qty })),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Order could not be saved (${res.status})`);
  return {
    id: data.order_enquiry?.id,
    reference: data.reference,
    status: data.order_enquiry?.status,
    subtotal: data.order_enquiry?.subtotal,
    packing_fee: data.packing_fee,
    grand_total: data.grand_total,
  };
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
};

export async function trackOrder(reference: string, phone: string): Promise<TrackedOrder> {
  if (!BACKEND_URL) throw new Error('Order tracking is not available right now. Please contact us on WhatsApp.');
  const params = new URLSearchParams({ ref: reference.replace(/^#/, '').trim(), phone: `+91${phone.trim()}` });
  const res = await fetch(`${BACKEND_URL}/store/order-enquiry/track?${params}`, { headers: headers() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Order not found');
  return data.order as TrackedOrder;
}

export async function fetchBrands(): Promise<Brand[]> {
  if (!BACKEND_URL) return FALLBACK_BRANDS;
  try {
    const res = await fetch(`${BACKEND_URL}/store/brands`, { headers: headers() });
    if (!res.ok) return FALLBACK_BRANDS;
    const data = await res.json();
    const list = (data?.brands || [])
      .filter((b: any) => b?.logo_url)
      .map((b: any) => ({ name: b.name, logo_url: b.logo_url }));
    return list.length ? list : FALLBACK_BRANDS;
  } catch {
    return FALLBACK_BRANDS;
  }
}

/**
 * Customer confirmation email with the estimate PDF attached. Served by the
 * Vercel function in /api; silently skipped in local dev where it doesn't exist.
 */
export function sendConfirmationEmail(payload: Record<string, unknown>): void {
  if (env.DEV) return;
  fetch('/api/send-order-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
