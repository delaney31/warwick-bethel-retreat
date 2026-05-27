import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { GuideSection } from "@/lib/content/guides/types";
import type { GuideTheme } from "./guide-layout";

interface TableOfContentsProps {
  sections: GuideSection[];
  theme?: GuideTheme;
}

export function TableOfContents({ sections, theme = "luxury" }: TableOfContentsProps) {
  const isRetreat = theme === "retreat";

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        "rounded-2xl border p-6",
        isRetreat
          ? "border-stone-200 bg-white"
          : "border-midnight-100 bg-midnight-50/50",
      )}
    >
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-widest",
          isRetreat ? "text-stone-500" : "text-midnight-400",
        )}
      >
        On this page
      </p>
      <ol className="mt-4 space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <Link
              href={`#${section.id}`}
              className={cn(
                "block text-sm transition",
                section.level === 3 ? "pl-3" : "",
                isRetreat
                  ? "text-stone-600 hover:text-sage-800"
                  : "text-midnight-600 hover:text-gold-700",
              )}
            >
              {section.heading}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
