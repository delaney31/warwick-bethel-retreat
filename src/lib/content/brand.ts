/** Canonical production domain (no trailing slash). */
export const CANONICAL_HOST = "tuxedoretreat.com";

export const CANONICAL_SITE_URL = `https://${CANONICAL_HOST}`;

export const SITE_NAME = "Tuxedo Retreat";

export const SITE_TAGLINE = "Luxury nightly stay near Warwick Bethel";

export const SITE_TITLE = "Lodging Near Warwick Bethel | Tuxedo Retreat";

export const SITE_DESCRIPTION =
  "Lodging near Warwick Bethel at Tuxedo Retreat — peaceful Bethel visitor accommodation in Tuxedo, NY. Host-reviewed stays from $150/night, secure payment after approval.";

export const HERO_EYEBROW = "Tuxedo Retreat · Luxury nightly stay near Warwick Bethel";

export const HERO_HEADLINE = "A peaceful luxury stay minutes from Warwick Bethel";

export const HERO_SUBHEADLINE =
  "Tuxedo Retreat offers two serene bedrooms, wooded views, and warm private hosting for Bethel visitors who want comfort after full days at Warwick.";

/** Vercel deployment hostnames that must 308 to the canonical site. */
export const LEGACY_REDIRECT_HOSTS = [
  "warwick-bethel-retreat.vercel.app",
  "warwick.bethel.retreat.vercel.app",
  "www.tuxedoretreat.com",
] as const;

/** Vercel apex A record — use for DNS verification. */
export const VERCEL_APEX_A_RECORD = "76.76.21.21";

/** Vercel DNS CNAME target for www and ALIAS apex. */
export const VERCEL_DNS_CNAME = "cname.vercel-dns.com";

function isLegacyDeployUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.endsWith(".vercel.app")) return true;
    if (host === `www.${CANONICAL_HOST}`) return true;
    return LEGACY_REDIRECT_HOSTS.includes(host as (typeof LEGACY_REDIRECT_HOSTS)[number]);
  } catch {
    return true;
  }
}

/**
 * Canonical public site URL for metadata, Stripe, sitemap, and payment links.
 * Never returns a *.vercel.app URL — works in the browser and on the server.
 */
export function getCanonicalSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");

  if (fromEnv && !isLegacyDeployUrl(fromEnv)) {
    return fromEnv;
  }

  if (process.env.NODE_ENV === "production") {
    return CANONICAL_SITE_URL;
  }

  return fromEnv || "http://localhost:3000";
}

export function pageTitle(segment?: string): string {
  if (!segment) return SITE_TITLE;
  return `${segment} | ${SITE_NAME}`;
}
