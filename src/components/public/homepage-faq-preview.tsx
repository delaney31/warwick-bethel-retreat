import Link from "next/link";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { FAQ_ITEMS } from "@/lib/content/faq";
import { HOMEPAGE_FAQ_PREVIEW_QUESTIONS } from "@/lib/content/homepage";
import { Button } from "@/components/ui/button";

export function HomepageFaqPreview() {
  const previewItems = HOMEPAGE_FAQ_PREVIEW_QUESTIONS.map((q) => {
    const item = FAQ_ITEMS.find((f) => f.question === q);
    return item ?? { question: q, answer: "" };
  }).filter((item) => item.answer);

  return (
    <section className="bg-stone-50 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
            Before you request
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light text-stone-900 md:text-4xl">
            Questions Bethel visitors ask
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-stone-600">
            Distance, rates, laundry, and how host-reviewed booking works — answered plainly.
          </p>
        </div>

        <div className="mt-10">
          <FaqAccordion items={previewItems} />
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href="/faq" variant="secondary">
            Read full FAQ
          </Button>
          <Link
            href="/contact"
            className="text-sm font-medium text-sage-700 underline-offset-2 hover:underline"
          >
            Contact your host →
          </Link>
        </div>
      </div>
    </section>
  );
}
