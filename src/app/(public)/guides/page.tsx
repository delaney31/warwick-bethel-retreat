import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/content/guides";
import { pageMetadata } from "@/lib/content/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Guides for Bethel Visitors",
  description:
    "Planning guides for Warwick Bethel visitors — where to stay, trip planning, and Tuxedo vs Warwick lodging from Tuxedo Retreat.",
  path: "/guides",
});

function formatGuideDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function GuidesIndexPage() {
  const sorted = [...GUIDES].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <div className="bg-stone-50 pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
          Guides
        </p>
        <h1 className="mt-3 font-serif text-4xl font-light text-stone-900 md:text-5xl">
          Guides for Bethel visitors
        </h1>
        <p className="mt-4 text-base leading-relaxed text-stone-600">
          Thoughtful planning for your Warwick visit — lodging, travel, and what to expect
          at Tuxedo Retreat.
        </p>

        <ul className="mt-14 space-y-8">
          {sorted.map((guide) => (
            <li
              key={guide.slug}
              className="border-b border-stone-200 pb-8 last:border-0"
            >
              <Link href={`/guides/${guide.slug}`} className="group block">
                <h2 className="text-xl font-medium text-stone-900 group-hover:text-sage-800">
                  {guide.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {guide.description}
                </p>
                <p className="mt-3 text-xs text-stone-400">
                  Updated {formatGuideDate(guide.updatedAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
