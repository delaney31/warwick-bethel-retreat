/** Canonical production domain (no trailing slash). */
export const CANONICAL_HOST = "tuxedoretreat.com";

export const SITE_NAME = "Tuxedo Retreat";

export const SITE_TAGLINE = "Luxury nightly stay near Warwick Bethel";

export const SITE_TITLE = "Tuxedo Retreat — Luxury Stay Near Warwick Bethel";

export const SITE_DESCRIPTION =
  "A quiet luxury nightly stay near Warwick Bethel with two bedrooms, wooded views, host-reviewed bookings, and secure payment after approval.";

export const HERO_EYEBROW = "Tuxedo Retreat · Luxury nightly stay near Warwick Bethel";

export const HERO_HEADLINE = "A peaceful luxury stay minutes from Warwick Bethel";

export const HERO_SUBHEADLINE =
  "Tuxedo Retreat offers two serene bedrooms, wooded views, and warm private hosting for Bethel visitors who want comfort after full days at Warwick.";

/** Hosts that should 308-redirect to the canonical site (set in Vercel + middleware). */
export const LEGACY_REDIRECT_HOSTS = [
  "warwick-bethel-retreat.vercel.app",
  "www.tuxedoretreat.com",
] as const;

export function getCanonicalSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    return `https://${CANONICAL_HOST}`;
  }
  return "http://localhost:3000";
}

export function pageTitle(segment?: string): string {
  if (!segment) return SITE_TITLE;
  return `${segment} | ${SITE_NAME}`;
}
