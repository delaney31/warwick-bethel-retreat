import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { GuidePageView } from "@/components/guides/guide-page";
import { GUIDE_SLUGS, getGuideBySlug, isGuideSlug } from "@/lib/content/guides";
import { pageMetadata } from "@/lib/content/site-metadata";
import { articleSchema } from "@/lib/seo/article-schema";
import {
  breadcrumbSchema,
  faqPageSchema,
  lodgingBusinessSchema,
} from "@/lib/seo/json-ld";

interface GuideRouteProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuideRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Not Found" };

  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${slug}`,
    ogImage: guide.heroImage,
  });
}

export default async function GuideRoute({ params }: GuideRouteProps) {
  const { slug } = await params;
  if (!isGuideSlug(slug)) notFound();

  const guide = getGuideBySlug(slug)!;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ]),
          lodgingBusinessSchema(),
          articleSchema(guide),
          faqPageSchema(guide.faqs),
        ]}
      />
      <nav className="border-b border-stone-200 bg-white py-3">
        <div className="mx-auto max-w-7xl px-4 text-sm text-stone-500 md:px-8">
          <Link href="/" className="hover:text-sage-800">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/guides" className="hover:text-sage-800">
            Guides
          </Link>
          <span className="mx-2">/</span>
          <span className="text-stone-700">{guide.title}</span>
        </div>
      </nav>
      <GuidePageView guide={guide} theme="retreat" />
    </>
  );
}
