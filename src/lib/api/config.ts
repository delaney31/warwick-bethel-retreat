/**
 * Runtime entry for `getApiBaseUrl()` — delegates to `resolve-api-url.ts` for rules.
 *
 * **Production:** uses `process.env.NEXT_PUBLIC_API_BASE_URL` first, then `NEXT_PUBLIC_API_URL`,
 * then `INTERNAL_API_URL`. Loopback URLs are never used on Vercel / production builds.
 *
 * **Local dev:** falls back to `http://localhost:5001/api` when nothing else is set.
 *
 * **Production, no env resolved:** browser uses `window.location.origin + '/api'`; Vercel SSR uses
 * `https://${VERCEL_URL}/api` so Next rewrites can proxy to the backend without relying on inlined
 * `NEXT_PUBLIC_*` in every edge case.
 */

import {
  isLoopbackUrl,
  resolvePublicApiBaseUrl,
  tryNormalizeApiBase,
} from "./resolve-api-url";
import { ApiConfigurationError } from "./errors";

/**
 * True for production builds and Vercel deployments (including Preview).
 */
function isDeployedEnvironment(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1"
  );
}

/**
 * Returns the API base URL (must end with `/api`) for `client.ts`, server components, and helpers.
 */
export function getApiBaseUrl(): string {
  const isProd = isDeployedEnvironment();
  const internalOrigin = process.env.INTERNAL_API_URL?.trim();

  const publicResolved = resolvePublicApiBaseUrl(process.env, isProd);
  const fromInternal = tryNormalizeApiBase(internalOrigin, isProd);
  const resolved = publicResolved ?? fromInternal;

  if (resolved) {
    if (isProd && isLoopbackUrl(resolved)) {
      throw new ApiConfigurationError(
        "API base URL resolves to localhost in production. Set NEXT_PUBLIC_API_BASE_URL to your deployed API " +
          "(e.g. https://pacific-luxe-direct.onrender.com). Remove loopback from NEXT_PUBLIC_API_URL and INTERNAL_API_URL.",
      );
    }
    return resolved;
  }

  if (isProd) {
    // Same-origin /api: Next.js rewrites (next.config) proxy to the real backend. Works when
    // NEXT_PUBLIC_* was not inlined in the client bundle but rewrites were built with INTERNAL_* / env.
    if (typeof window !== "undefined") {
      return `${window.location.origin}/api`;
    }
    const vercelHost = process.env.VERCEL_URL?.trim();
    if (vercelHost) {
      return `https://${vercelHost}/api`;
    }
    throw new ApiConfigurationError(
      "Set NEXT_PUBLIC_API_BASE_URL in production (e.g. https://pacific-luxe-direct.onrender.com). " +
        "Optional: INTERNAL_API_URL with the same origin for server-only fallback.",
    );
  }

  return "http://localhost:5001/api";
}

export { isLoopbackUrl } from "./resolve-api-url";
