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
  customer?: CustomerDetails
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
      ...customerBlock,
      'Items Ordered:',
      ...lines,
      '',
      `Items Total: Rs.${total.toLocaleString('en-IN')}`,
      `Packing Fee (2%): Rs.${packingFee.toLocaleString('en-IN')}`,
      `Transport Charges: To be confirmed`,
      `Grand Total: Rs.${grandTotal.toLocaleString('en-IN')} + transport`,
      '',
      'Please confirm availability, transport charges, and delivery. Thank you!',
    ].join('\n');
  }

  return `https://wa.me/${PRIMARY_PHONE_INTL}?text=${encodeURIComponent(message)}`;
}
