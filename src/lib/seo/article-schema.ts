import { getCanonicalSiteUrl, SITE_NAME } from "@/lib/content/brand";
import type { Guide } from "@/lib/content/guides/types";

type JsonLd = Record<string, unknown>;

function siteUrl(): string {
  return getCanonicalSiteUrl();
}

function absoluteUrl(path: string): string {
  const base = siteUrl();
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function articleSchema(guide: Guide): JsonLd {
  const url = absoluteUrl(`/guides/${guide.slug}`);
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: guide.title,
    description: guide.description,
    url,
    ...(guide.heroImage ? { image: absoluteUrl(guide.heroImage) } : {}),
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: {
      "@type": "Organization",
      name: guide.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl(),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
