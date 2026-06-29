// In-memory, per-IP rate limiter for the admin login flow.
//
// Scope & limitations (read before relying on this):
// - State lives in a module-level Map, so it is per–server-instance and resets
//   on redeploy/restart. On a single long-lived Node server (the typical
//   `next start` / single-container deploy) that is enough to blunt brute-force
//   attempts. On horizontally-scaled / serverless platforms each instance keeps
//   its own counter, so for stronger guarantees move this to a shared store
//   (Upstash Redis, etc.). It is deliberately dependency-free for now.

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

type Bucket = { count: number; resetTime: number };

const buckets = new Map<string, Bucket>();

// Opportunistic cleanup so the Map can't grow unbounded from one-off IPs.
function sweep(now: number): void {
  for (const [ip, bucket] of buckets) {
    if (bucket.resetTime <= now) buckets.delete(ip);
  }
}

export type RateLimitResult = {
  /** True when the caller is still allowed to attempt a login. */
  allowed: boolean;
  /** Attempts left in the current window (0 when blocked). */
  remaining: number;
  /** Epoch ms at which the window resets. */
  resetTime: number;
};

/**
 * Check (without mutating) whether `ip` may attempt a login right now.
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || bucket.resetTime <= now) {
    return { allowed: true, remaining: MAX_ATTEMPTS, resetTime: now + WINDOW_MS };
  }

  return {
    allowed: bucket.count < MAX_ATTEMPTS,
    remaining: Math.max(0, MAX_ATTEMPTS - bucket.count),
    resetTime: bucket.resetTime,
  };
}

/**
 * Record one FAILED login attempt for `ip`. Call this only on auth failure so
 * that successful logins never count against the limit.
 */
export function registerFailedAttempt(ip: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(ip);
  const bucket: Bucket =
    !existing || existing.resetTime <= now
      ? { count: 0, resetTime: now + WINDOW_MS }
      : existing;

  bucket.count += 1;
  buckets.set(ip, bucket);

  return {
    allowed: bucket.count < MAX_ATTEMPTS,
    remaining: Math.max(0, MAX_ATTEMPTS - bucket.count),
    resetTime: bucket.resetTime,
  };
}

/** Clear the counter for `ip` (e.g. after a successful login). */
export function resetRateLimit(ip: string): void {
  buckets.delete(ip);
}
