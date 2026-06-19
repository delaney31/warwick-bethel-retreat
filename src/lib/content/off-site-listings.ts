/** Optional third-party listing URLs — set in Vercel env after profiles are live. */
export type OffSiteListing = {
  id: "google" | "airbnb" | "vrbo";
  label: string;
  href: string;
  description: string;
};

const LISTING_CONFIG: Array<Omit<OffSiteListing, "href"> & { envKey: string }> = [
  {
    id: "google",
    envKey: "NEXT_PUBLIC_GOOGLE_BUSINESS_URL",
    label: "Google Business Profile",
    description: "Hours, directions, and reviews on Google Maps",
  },
  {
    id: "airbnb",
    envKey: "NEXT_PUBLIC_AIRBNB_LISTING_URL",
    label: "Airbnb",
    description: "Book through Airbnb when you prefer that platform",
  },
  {
    id: "vrbo",
    envKey: "NEXT_PUBLIC_VRBO_LISTING_URL",
    label: "Vrbo",
    description: "Book through Vrbo when you prefer that platform",
  },
];

export function getConfiguredOffSiteListings(): OffSiteListing[] {
  return LISTING_CONFIG.flatMap((item) => {
    const href = process.env[item.envKey]?.trim();
    if (!href) return [];
    return [{ id: item.id, label: item.label, href, description: item.description }];
  });
}

export function getSameAsProfileUrls(): string[] {
  return getConfiguredOffSiteListings().map((listing) => listing.href);
}
