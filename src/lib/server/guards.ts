import { getCloudflareContext } from "@opennextjs/cloudflare";

type RateLimiter = { limit(options: { key: string }): Promise<{ success: boolean }> };

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const memory = new Map<string, number[]>();

function binding(): RateLimiter | undefined {
  try {
    return (getCloudflareContext().env as { FORM_RATE_LIMITER?: RateLimiter }).FORM_RATE_LIMITER;
  } catch {
    return undefined; // Not running inside a Worker (e.g. unit tests).
  }
}

/**
 * Uses the Cloudflare Workers Rate Limiting binding when available. Falls
 * back to a per-isolate in-memory window, which is best-effort only.
 */
export async function isRateLimited(key: string): Promise<boolean> {
  const limiter = binding();
  if (limiter) return !(await limiter.limit({ key })).success;

  const now = Date.now();
  const hits = (memory.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  memory.set(key, hits);
  return hits.length > MAX_PER_WINDOW;
}

export function clientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/**
 * Verifies a Cloudflare Turnstile token. When no secret is configured the
 * check is skipped (local development); production must set
 * TURNSTILE_SECRET_KEY — see docs/DEPLOYMENT.md.
 */
export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip !== "unknown") body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verification failed", err);
    return false;
  }
}
