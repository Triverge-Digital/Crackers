/**
 * Customer-facing reference for an enquiry: the last 8 characters of the
 * ULID-style id, upper-cased. The storefront derives the same value, so the
 * number a customer quotes on WhatsApp can be matched back to the row.
 */
export function referenceFromId(id: string): string {
  return id.slice(-8).toUpperCase()
}

export function normalizeReference(input: string): string {
  return input.trim().replace(/^#/, "").toUpperCase()
}

export function normalizeIndianPhone(input: string): string | null {
  const digits = input.replace(/[^\d]/g, "")
  const national = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits
  if (!/^[6-9]\d{9}$/.test(national)) return null
  return `+91${national}`
}
