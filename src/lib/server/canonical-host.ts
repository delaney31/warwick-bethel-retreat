import type { NextRequest } from "next/server";
import { CANONICAL_HOST, getCanonicalSiteUrl, LEGACY_REDIRECT_HOSTS } from "@/lib/content/brand";

/** Redirect www and legacy Vercel hosts to the canonical production URL. */
export function getCanonicalRedirectUrl(request: NextRequest): URL | null {
  const host = request.headers.get("host")?.toLowerCase().split(":")[0] ?? "";
  if (!host || host === "localhost" || host.endsWith(".localhost")) {
    return null;
  }

  const canonical = new URL(getCanonicalSiteUrl());
  const canonicalHost = canonical.hostname.toLowerCase();

  const shouldRedirect =
    host === `www.${canonicalHost}` ||
    LEGACY_REDIRECT_HOSTS.includes(host as (typeof LEGACY_REDIRECT_HOSTS)[number]) ||
    (host.endsWith(".vercel.app") && host !== canonicalHost);

  if (!shouldRedirect || host === canonicalHost) {
    return null;
  }

  const dest = new URL(request.nextUrl.pathname + request.nextUrl.search, canonical);
  return dest;
}
