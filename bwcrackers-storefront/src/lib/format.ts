const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** ₹ with Indian digit grouping (₹1,00,000). Used everywhere a price is shown. */
export function formatINR(amount: number): string {
  return `₹${inr.format(Math.round(amount))}`;
}

/** Plain-text variant for WhatsApp / PDF where the rupee glyph may not render. */
export function formatRs(amount: number): string {
  return `Rs.${inr.format(Math.round(amount))}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
