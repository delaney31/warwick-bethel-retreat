import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { FAQ_ITEMS } from "@/lib/content/faq";
import { pageMetadata } from "@/lib/content/site-metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/json-ld";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description: "Rates, booking process, and stay details for Tuxedo Retreat near Warwick Bethel.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <div className="bg-stone-50 pt-28 pb-20">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          faqPageSchema(FAQ_ITEMS),
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <h1 className="font-serif text-4xl font-light text-stone-900">Frequently asked questions</h1>
        <div className="mt-10">
          <FaqAccordion />
        </div>
        <p className="mt-10 text-sm text-stone-600">
          Ready to book?{" "}
          <Link href="/book" className="font-medium text-sage-700 underline-offset-2 hover:underline">
            Request your stay
          </Link>{" "}
          or{" "}
          <Link href="/rooms" className="font-medium text-sage-700 underline-offset-2 hover:underline">
            view rooms &amp; rates
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
