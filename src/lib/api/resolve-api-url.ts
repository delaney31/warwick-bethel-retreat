/**
 * Central resolution for the ASP.NET API URL used by the Next.js app.
 *
 * **Production priority (same for SSR and browser):**
 * 1. `NEXT_PUBLIC_API_BASE_URL` — API **origin** (e.g. `https://pacific-luxe-direct.onrender.com`); `/api` appended in code.
 * 2. `NEXT_PUBLIC_API_URL` — legacy full base ending with `/api` (skipped in prod if loopback).
 * 3. `INTERNAL_API_URL` — server-only origin (Docker / Vercel runtime); used when (1)(2) missing or unusable.
 *
 * **Local development:** if nothing resolves, fallback `http://localhost:5001` (+ `/api` where applicable).
 *
 * Loopback hosts are never used when `isProd` is true (Vercel / production build).
 */

export function normalizeToApiBase(raw: string): string {
  let u = raw.trim().replace(/\/$/, "");
  if (!u.endsWith("/api")) {
    u = `${u}/api`;
  }
  return u;
}

/** True if URL targets loopback (localhost / 127.0.0.1 / ::1). */
export function isLoopbackUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  try {
    const u = /^https?:\/\//i.test(trimmed)
      ? new URL(trimmed)
      : new URL(`http://${trimmed}`);
    return (
      u.hostname === "localhost" ||
      u.hostname === "127.0.0.1" ||
      u.hostname === "::1"
    );
  } catch {
    return false;
  }
}

/**
 * Resolves `NEXT_PUBLIC_API_BASE_URL` then `NEXT_PUBLIC_API_URL` to a base ending in `/api`.
 * Returns null if neither is set or both are unusable (e.g. loopback in prod).
 */
export function resolvePublicApiBaseUrl(
  env: Pick<NodeJS.ProcessEnv, "NEXT_PUBLIC_API_BASE_URL" | "NEXT_PUBLIC_API_URL">,
  isProd: boolean,
): string | null {
  const tryBase = (raw: string | undefined): string | null => {
    if (!raw?.trim()) return null;
    const t = raw.trim();
    if (isProd && isLoopbackUrl(t)) return null;
    return normalizeToApiBase(t);
  };
  return (
    tryBase(env.NEXT_PUBLIC_API_BASE_URL) ?? tryBase(env.NEXT_PUBLIC_API_URL) ?? null
  );
}

/**
 * Normalize a candidate API origin (or full `/api` URL) for use as the API base.
 */
export function tryNormalizeApiBase(
  raw: string | undefined,
  isProd: boolean,
): string | null {
  if (!raw?.trim()) return null;
  const t = raw.trim();
  if (isProd && isLoopbackUrl(t)) return null;
  return normalizeToApiBase(t);
}

/**
 * Backend **origin** only (no `/api`) for `next.config` rewrites.
 * Evaluates candidates **in order** and skips loopback in production — unlike `a || b || c`,
 * a bad legacy URL does not block a later valid `INTERNAL_API_URL`.
 */
export function resolveBackendOriginForRewrites(
  env: Pick<
    NodeJS.ProcessEnv,
    "NEXT_PUBLIC_API_BASE_URL" | "NEXT_PUBLIC_API_URL" | "INTERNAL_API_URL"
  >,
  isProd: boolean,
): string | null {
  const candidates = [
    env.NEXT_PUBLIC_API_BASE_URL?.trim(),
    env.NEXT_PUBLIC_API_URL?.trim(),
    env.INTERNAL_API_URL?.trim(),
  ].filter((x): x is string => Boolean(x));

  for (const raw of candidates) {
    if (isProd && isLoopbackUrl(raw)) continue;
    let u = raw.replace(/\/$/, "");
    if (u.endsWith("/api")) {
      u = u.slice(0, -4);
    }
    return u;
  }

  return !isProd ? "http://localhost:5001" : null;
}
