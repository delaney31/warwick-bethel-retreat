import Link from "next/link";
import { FaqAccordion } from "@/components/public/faq-accordion";
import type { GuideFaq } from "@/lib/content/guides/types";
import { cn } from "@/lib/utils/cn";
import type { GuideTheme } from "./guide-layout";

interface FAQSectionProps {
  faqs: GuideFaq[];
  theme?: GuideTheme;
}

export function FAQSection({ faqs, theme = "luxury" }: FAQSectionProps) {
  const isRetreat = theme === "retreat";

  return (
    <section className="mt-16 border-t border-midnight-100 pt-16">
      <h2
        className={cn(
          "text-2xl font-bold tracking-tight",
          isRetreat ? "font-serif font-light text-stone-900" : "text-midnight-950",
        )}
      >
        Frequently asked questions
      </h2>
      <div className="mt-8">
        <FaqAccordion
          items={faqs.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
          }))}
        />
      </div>
      <p className={cn("mt-6 text-sm", isRetreat ? "text-stone-500" : "text-midnight-500")}>
        More answers on our{" "}
        <Link
          href="/faq"
          className={
            isRetreat
              ? "font-medium text-sage-700 hover:underline"
              : "font-medium text-gold-700 hover:text-gold-600"
          }
        >
          full FAQ
        </Link>
        .
      </p>
    </section>
  );
}
