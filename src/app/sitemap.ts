import type { MetadataRoute } from "next";
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

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getCanonicalSiteUrl();
  const lastModified = new Date();

  return PUBLIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/book" ? 0.9 : 0.7,
  }));
}
