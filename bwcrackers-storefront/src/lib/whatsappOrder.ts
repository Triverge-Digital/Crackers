import { pricelist } from '../data/pricelist';
import { PRIMARY_PHONE_INTL } from '../constants';

type CustomerDetails = {
  name: string;
  phone: string;
  address: string;
};

export function buildWhatsAppOrderUrl(
  cart: Record<string, number>,
  total: number,
  packingFee: number,
  customer?: CustomerDetails,
  referenceNumber?: string
): string {
  const lines: string[] = [];

  pricelist.forEach(cat => {
    cat.products.forEach(p => {
      const qty = cart[p.code];
      if (qty) {
        lines.push(`- ${p.name} (${p.unit}) x${qty} = Rs.${(p.discountPrice * qty).toLocaleString('en-IN')}`);
      }
    });
  });

  let message: string;
  if (lines.length === 0) {
    message = "Hi BW Crackers, I'd like to know more about your products.";
  } else {
    const refBlock = referenceNumber ? [`Order Ref: ${referenceNumber}`] : [];

    const customerBlock = customer
      ? [
          `Name: ${customer.name}`,
          `Phone: +91 ${customer.phone}`,
          `Address: ${customer.address}`,
          '',
        ]
      : [];

    const grandTotal = total + packingFee;

    message = [
      'Hi BW Crackers! I would like to place the following order:',
      '',
      ...refBlock,
      ...customerBlock,
      'Items Ordered:',
      ...lines,
      '',
      `Items Total: Rs.${total.toLocaleString('en-IN')}`,
      `Packing Fee (2%): Rs.${packingFee.toLocaleString('en-IN')}`,
      `Total Amount: Rs.${grandTotal.toLocaleString('en-IN')}`,
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
  const message = `Hi BW Crackers, I have completed the payment${ref} (Rs.${amount.toLocaleString('en-IN')}). Sharing the payment screenshot below.`;
  return `https://wa.me/${PRIMARY_PHONE_INTL}?text=${encodeURIComponent(message)}`;
}
