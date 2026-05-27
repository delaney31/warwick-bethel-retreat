import Link from "next/link";
import type { Guide, GuideLink } from "@/lib/content/guides/types";
import { getGuideBySlug } from "@/lib/content/guides";
import { cn } from "@/lib/utils/cn";
import type { GuideTheme } from "./guide-layout";

interface RelatedLinksProps {
  links: GuideLink[];
  relatedGuideSlugs?: string[];
  theme?: GuideTheme;
}

export function RelatedLinks({
  links,
  relatedGuideSlugs = [],
  theme = "luxury",
}: RelatedLinksProps) {
  const isRetreat = theme === "retreat";
  const relatedGuides = relatedGuideSlugs
    .map((slug) => getGuideBySlug(slug))
    .filter((g): g is Guide => Boolean(g));

  if (links.length === 0 && relatedGuides.length === 0) return null;

  return (
    <div className="space-y-8">
      {relatedGuides.length > 0 && (
        <div
          className={cn(
            "rounded-2xl border p-6",
            isRetreat ? "border-stone-200 bg-white" : "border-midnight-100 bg-white",
          )}
        >
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-widest",
              isRetreat ? "text-stone-500" : "text-midnight-400",
            )}
          >
            More guides
          </p>
          <ul className="mt-4 space-y-3">
            {relatedGuides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className={cn(
                    "text-sm font-medium",
                    isRetreat
                      ? "text-sage-700 hover:underline"
                      : "text-gold-700 hover:text-gold-600",
                  )}
                >
                  {guide.title} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {links.length > 0 && (
        <div
          className={cn(
            "rounded-2xl border p-6",
            isRetreat ? "border-stone-200 bg-white" : "border-midnight-100 bg-white",
          )}
        >
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-widest",
              isRetreat ? "text-stone-500" : "text-midnight-400",
            )}
          >
            Explore
          </p>
          <ul className="mt-4 space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm",
                    isRetreat
                      ? "text-stone-600 hover:text-sage-800"
                      : "text-midnight-600 hover:text-gold-700",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
