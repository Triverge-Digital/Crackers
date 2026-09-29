import { MedusaRequest } from "@medusajs/framework/http"

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/**
 * Minimal fixed-window rate limiter kept in process memory. Good enough for a
 * single-instance deployment to stop a script from flooding the enquiry table;
 * it is intentionally not shared across instances.
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
    }
    return false
  }

  bucket.count += 1
  return bucket.count > limit
}

export function clientIp(req: MedusaRequest): string {
  const forwarded = req.headers["x-forwarded-for"]
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0]
  return (first || req.socket?.remoteAddress || "unknown").trim()
}
