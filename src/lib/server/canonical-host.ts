import type { NextRequest } from "next/server";
import {
  CANONICAL_HOST,
  CANONICAL_SITE_URL,
  getCanonicalSiteUrl,
  LEGACY_REDIRECT_HOSTS,
} from "@/lib/content/brand";

function normalizeHost(host: string): string {
  return host.toLowerCase().split(":")[0];
}

function isLegacyOrWwwHost(host: string, canonicalHost: string): boolean {
  if (host === canonicalHost) return false;
  if (host === `www.${canonicalHost}`) return true;
  if (LEGACY_REDIRECT_HOSTS.includes(host as (typeof LEGACY_REDIRECT_HOSTS)[number])) {
    return true;
  }
  if (host.endsWith(".vercel.app")) return true;
  return false;
}

/** Redirect www, legacy Vercel hosts, and misconfigured hosts to https://tuxedoretreat.com. */
export function getCanonicalRedirectUrl(request: NextRequest): URL | null {
  const host = normalizeHost(request.headers.get("host") ?? "");
  if (!host || host === "localhost" || host.endsWith(".localhost")) {
    return null;
  }

  const canonicalHost = CANONICAL_HOST;
  const canonicalBase = getCanonicalSiteUrl() || CANONICAL_SITE_URL;

  if (!isLegacyOrWwwHost(host, canonicalHost)) {
    return null;
  }

  return new URL(request.nextUrl.pathname + request.nextUrl.search, canonicalBase);
}
