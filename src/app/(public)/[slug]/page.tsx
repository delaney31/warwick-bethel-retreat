import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { SeoLandingPageView } from "@/components/public/seo-landing-page";
import {
  SEO_LANDING_SLUGS,
  getSeoLandingPage,
  isSeoLandingSlug,
} from "@/lib/content/seo-landings";
import { pageMetadata } from "@/lib/content/site-metadata";
import {
  breadcrumbSchema,
  faqPageSchema,
  lodgingBusinessSchema,
} from "@/lib/seo/json-ld";

interface SeoLandingRouteProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SEO_LANDING_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: SeoLandingRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const landing = getSeoLandingPage(slug);
  if (!landing) return { title: "Not Found" };

  return pageMetadata({
    title: landing.metaTitle,
    description: landing.metaDescription,
    path: `/${slug}`,
    noIndex: false,
  });
}

export const dynamic = "force-static";

export default async function SeoLandingRoute({ params }: SeoLandingRouteProps) {
  const { slug } = await params;
  if (!isSeoLandingSlug(slug)) notFound();

  const landing = getSeoLandingPage(slug)!;

  const schemaNodes = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: landing.metaTitle, path: `/${slug}` },
    ]),
    faqPageSchema(landing.faqs),
  ];

  if (landing.includeLodgingSchema) {
    schemaNodes.unshift(lodgingBusinessSchema());
  }

  return (
    <>
      <JsonLd data={schemaNodes} />
      <SeoLandingPageView page={landing} />
    </>
  );
}
