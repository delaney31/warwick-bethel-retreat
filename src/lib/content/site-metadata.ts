import type { Metadata } from "next";
import {
  CANONICAL_HOST,
  getCanonicalSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
} from "@/lib/content/brand";
import { PROPERTY_IMAGES } from "@/lib/content/property";

const siteUrl = getCanonicalSiteUrl();

export const DEFAULT_OG_IMAGE_PATH = PROPERTY_IMAGES.hero;

export const privateRouteMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/** Explicit index signals for public marketing and SEO landing pages. */
export const indexableRouteMetadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function pageMetadata({
  title,
  description,
  path = "/",
  ogImage = DEFAULT_OG_IMAGE_PATH,
  absoluteTitle = false,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  absoluteTitle?: boolean;
  noIndex?: boolean;
}): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const pageTitle = `${title} | ${SITE_NAME}`;
  const ogImagePath = ogImage.startsWith("http") ? ogImage : ogImage.startsWith("/") ? ogImage : `/${ogImage}`;
  const ogImageUrl = ogImagePath.startsWith("http") ? ogImagePath : `${siteUrl}${ogImagePath}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: `${siteUrl}${canonicalPath}`,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImageUrl],
    },
    robots: noIndex ? privateRouteMetadata.robots : indexableRouteMetadata.robots,
  };
}

export { CANONICAL_HOST, siteUrl };
