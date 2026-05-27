import type { MetadataRoute } from "next";
import { GUIDE_SLUGS } from "@/lib/content/guides";
import { SEO_LANDING_SLUGS } from "@/lib/content/seo-landings";
import { getCanonicalSiteUrl } from "@/lib/content/brand";

const PUBLIC_ROUTES = [
  "",
  "/rooms",
  "/gallery",
  "/availability",
  "/book",
  "/faq",
  "/contact",
] as const;

/** High-intent SEO URLs also emitted via SEO_LANDING_SLUGS — listed for sitemap priority. */
const PRIORITY_SEO_SLUGS = [
  "stay-near-warwick-bethel",
  "lodging-near-warwick-bethel",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getCanonicalSiteUrl();
  const lastModified = new Date();

  const coreEntries: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/book" ? 0.9 : 0.7,
  }));

  const seoLandingEntries: MetadataRoute.Sitemap = SEO_LANDING_SLUGS.map((slug) => ({
    url: `${base}/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: PRIORITY_SEO_SLUGS.includes(slug as (typeof PRIORITY_SEO_SLUGS)[number])
      ? 0.85
      : 0.8,
  }));

  const guideEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/guides`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    },
    ...GUIDE_SLUGS.map((slug) => ({
      url: `${base}/guides/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [...coreEntries, ...seoLandingEntries, ...guideEntries];
}
