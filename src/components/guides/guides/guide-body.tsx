import { parseInlineLinks } from "@/lib/content/guides/parse-inline";
import type { GuideSection } from "@/lib/content/guides/types";
import { cn } from "@/lib/utils/cn";
import type { GuideTheme } from "./guide-layout";

interface GuideBodyProps {
  sections: GuideSection[];
  theme?: GuideTheme;
}

export function GuideBody({ sections, theme = "luxury" }: GuideBodyProps) {
  const isRetreat = theme === "retreat";
  const linkClass = isRetreat
    ? "font-medium text-sage-700 underline-offset-2 hover:underline"
    : undefined;

  return (
    <div className="space-y-12">
      {sections.map((section) => {
        const Tag = section.level === 3 ? "h3" : "h2";
        return (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <Tag
              className={cn(
                "font-bold tracking-tight text-midnight-950",
                section.level === 3 ? "text-lg" : "text-2xl",
                isRetreat && "font-serif font-light text-stone-900",
                isRetreat && section.level !== 3 && "text-2xl md:text-3xl",
              )}
            >
              {section.heading}
            </Tag>
            <div
              className={cn(
                "mt-4 space-y-4 text-base leading-relaxed",
                isRetreat ? "text-stone-600" : "text-midnight-600",
              )}
            >
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>{parseInlineLinks(p, linkClass)}</p>
              ))}
            </div>
            {section.bullets && section.bullets.length > 0 && (
              <ul
                className={cn(
                  "mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed",
                  isRetreat ? "text-stone-600" : "text-midnight-600",
                )}
              >
                {section.bullets.map((item) => (
                  <li key={item.slice(0, 40)}>{parseInlineLinks(item, linkClass)}</li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
