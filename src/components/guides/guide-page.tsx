import { GuideLayout, GuideMain, GuideAside } from "./guide-layout";
import { GuideHero } from "./guide-hero";
import { TableOfContents } from "./table-of-contents";
import { GuideBody } from "./guide-body";
import { FAQSection } from "./faq-section";
import { GuideCtaSection } from "./cta-section";
import { RelatedLinks } from "./related-links";
import type { Guide } from "@/lib/content/guides/types";
import type { GuideTheme } from "./guide-layout";

interface GuidePageViewProps {
  guide: Guide;
  theme?: GuideTheme;
}

export function GuidePageView({ guide, theme = "luxury" }: GuidePageViewProps) {
  return (
    <GuideLayout theme={theme}>
      <GuideMain theme={theme}>
        <GuideHero
          title={guide.title}
          description={guide.description}
          author={guide.author}
          publishedAt={guide.publishedAt}
          updatedAt={guide.updatedAt}
          heroImage={guide.heroImage}
          heroImageAlt={guide.heroImageAlt}
          theme={theme}
        />
        <GuideBody sections={guide.sections} theme={theme} />
        <FAQSection faqs={guide.faqs} theme={theme} />
        <GuideCtaSection cta={guide.cta} theme={theme} />
      </GuideMain>
      <GuideAside>
        <TableOfContents sections={guide.sections} theme={theme} />
        <div className="mt-8">
          <RelatedLinks
            links={guide.relatedLinks}
            relatedGuideSlugs={guide.relatedGuideSlugs}
            theme={theme}
          />
        </div>
      </GuideAside>
    </GuideLayout>
  );
}
