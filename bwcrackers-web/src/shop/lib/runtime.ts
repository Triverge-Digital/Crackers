import { DEFAULT_SETTINGS, shopConstants, ShopConstants } from '@/lib/settings';

// Current shop settings for plain (non-React) browser modules such as the PDF
// estimate and WhatsApp message builders. Set by <ShopProvider>.
let current: ShopConstants = shopConstants(DEFAULT_SETTINGS);

export function setRuntimeConstants(c: ShopConstants) {
  current = c;
}

export function rt(): ShopConstants {
  return current;
}
