import "server-only";
import { HttpError } from "./http";

const buckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Best-effort, per-instance limiter for public forms (guest quotations, contact, reviews).
 * Stops casual spam bursts; it is not a substitute for a WAF.
 */
export function rateLimit(request: Request, scope: string, max: number, windowMs: number) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const key = `${scope}:${ip}`;
  const now = Date.now();

  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count += 1;
  if (bucket.count > max) {
    throw new HttpError(429, "Too many requests. Please wait a few minutes and try again.");
  }
}
