import { PRIMARY_PHONE_INTL, SITE_URL } from '../constants';
import { CartLine } from './catalog';
import { formatRs } from './format';

type CustomerSummary = {
  name: string;
  phone: string;
  address: string;
};

export function buildWhatsAppOrderUrl(
  lines: CartLine[],
  subtotal: number,
  packingFee: number,
  customer?: CustomerSummary,
  referenceNumber?: string
): string {
  let message: string;
  if (lines.length === 0) {
    message = "Hi B&W Crackers, I'd like to know more about your products.";
  } else {
    const itemLines = lines.map(l => `- ${l.product.name} (${l.product.unit}) x${l.qty} = ${formatRs(l.lineTotal)}`);
    const refBlock = referenceNumber ? [`Order Ref: ${referenceNumber}`] : [];
    const customerBlock = customer
      ? [`Name: ${customer.name}`, `Phone: +91 ${customer.phone}`, `Address: ${customer.address}`, '']
      : [];

    message = [
      'Hi B&W Crackers! I would like to place the following order:',
      '',
      ...refBlock,
      ...customerBlock,
      'Items Ordered:',
      ...itemLines,
      '',
      `Items Total: ${formatRs(subtotal)}`,
      `Packing Fee (2%): ${formatRs(packingFee)}`,
      `Total Amount: ${formatRs(subtotal + packingFee)}`,
      '',
      'Please confirm availability and delivery. Thank you!',
    ].join('\n');
  }

  return `https://wa.me/${PRIMARY_PHONE_INTL}?text=${encodeURIComponent(message)}`;
}

// Derives a short, customer-facing reference code from the backend's ULID id.
export function deriveReferenceNumber(id?: string | null): string {
  return id ? `#${id.slice(-8).toUpperCase()}` : '';
}

// wa.me link used on the post-payment screen — browsers can't auto-attach an
// image to a WhatsApp message, so this just opens a chat with pre-filled text
// the customer can send along with their manually-attached payment screenshot.
export function buildPaymentShareWhatsAppUrl(referenceNumber: string, amount: number): string {
  const ref = referenceNumber ? ` for Order ${referenceNumber}` : '';
  const message = `Hi B&W Crackers, I have completed the payment${ref} (${formatRs(amount)}). Sharing the payment screenshot below.`;
  return `https://wa.me/${PRIMARY_PHONE_INTL}?text=${encodeURIComponent(message)}`;
}

export function buildTrackingUrl(referenceNumber: string): string {
  return `${SITE_URL}/track?ref=${encodeURIComponent(referenceNumber.replace(/^#/, ''))}`;
}
