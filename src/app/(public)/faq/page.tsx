import type { Metadata } from "next";
import { FaqAccordion } from "@/components/public/faq-accordion";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FaqPage() {
  return (
    <div className="bg-stone-50 pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <h1 className="font-serif text-4xl font-light text-stone-900">Frequently asked questions</h1>
        <div className="mt-10">
          <FaqAccordion />
        </div>
      </div>
    </div>
  );
}
