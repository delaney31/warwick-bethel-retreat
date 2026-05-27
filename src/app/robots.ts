import type { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/lib/content/brand";

export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin", "/reservations/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
