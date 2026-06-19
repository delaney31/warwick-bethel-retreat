/** Canonical production domain (no trailing slash). */
export const CANONICAL_HOST = "tuxedoretreat.com";

export const CANONICAL_SITE_URL = `https://${CANONICAL_HOST}`;

export const SITE_NAME = "Tuxedo Retreat";

/** Primary guest contact — contact form, JSON-LD, and booking inquiries. */
export const SITE_CONTACT_EMAIL = "bookings@tuxedoretreat.com";

export const SITE_PHONE_DISPLAY = "(813) 493-7008";
export const SITE_PHONE_TEL = "+18134937008";

/** Visible host profile for trust on contact and booking pages. */
export const HOST_PROFILE = {
  name: "Timothy — your host",
  bio:
    "Tuxedo Retreat is personally hosted for Warwick Bethel visitors. I review every reservation request, answer questions before you book, and share clear check-in guidance after your stay is approved.",
  phoneDisplay: SITE_PHONE_DISPLAY,
  phoneTel: SITE_PHONE_TEL,
} as const;

export const SITE_TAGLINE = "Bethel visitor lodging · Warwick, NY area";

/** Clarifies location vs. unrelated Tuxedo Park resort listings. */
export const LOCATION_CLARITY =
  "Quiet cottage in the Warwick, NY area (Tuxedo Park neighborhood) — about 15 minutes from Warwick Bethel headquarters. Not a general Hudson Valley resort.";

export const SITE_TITLE = "Bethel Visitor Lodging Near Warwick Bethel | Tuxedo Retreat";

export const SITE_DESCRIPTION =
  "Bethel visitor lodging near Warwick Bethel at Tuxedo Retreat — peaceful cottage stays in the Warwick, NY area from $150/night. Host-reviewed booking, 15 minutes from headquarters.";

export const HERO_EYEBROW = "Bethel visitor stay · Tuxedo Retreat · Warwick area";

export const HERO_HEADLINE = "Bethel visitor lodging near Warwick Bethel";

export const HERO_SUBHEADLINE =
  "Tuxedo Retreat is a host-managed cottage for Warwick Bethel visitors — two serene bedrooms, wooded quiet, and a short drive to headquarters after full convention days.";

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
