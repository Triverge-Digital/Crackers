// Shared order vocabulary for the order API, tracking and the admin panel.

export const ORDER_STATUSES = ['pending', 'confirmed', 'paid', 'packed', 'dispatched', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'New',
  confirmed: 'Confirmed',
  paid: 'Paid',
  packed: 'Packed',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  paid: 'bg-emerald-100 text-emerald-800',
  packed: 'bg-violet-100 text-violet-800',
  dispatched: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-200 text-gray-700',
};

/** "9876543210" / "+91 98765 43210" → "+919876543210", or null if not a valid Indian mobile. */
export function normalizeIndianPhone(input: string): string | null {
  const digits = String(input).replace(/\D/g, '');
  const national = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(national) ? `+91${national}` : null;
}

const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I

/** Short customer-facing reference, e.g. "BW7K2Q9P". */
export function newReference(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return 'BW' + Array.from(bytes, b => REF_ALPHABET[b % REF_ALPHABET.length]).join('');
}

export const normalizeReference = (input: string) => input.trim().replace(/^#/, '').toUpperCase();
