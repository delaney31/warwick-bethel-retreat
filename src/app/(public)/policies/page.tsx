import type { Metadata } from "next";
import Link from "next/link";
import {
  CHECK_IN_OUT_NOTE,
  POLICY_SECTIONS,
} from "@/lib/content/policies";
import { pageMetadata } from "@/lib/content/site-metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/json-ld";

export const metadata: Metadata = pageMetadata({
  title: "Policies",
  description:
    "Check-in and check-out times, house rules, cancellation policy, and privacy for Tuxedo Retreat near Warwick Bethel.",
  path: "/policies",
});

export default function PoliciesPage() {
  return (
    <div className="bg-stone-50 pt-28 pb-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Policies", path: "/policies" },
        ])}
      />
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600">Policies</p>
        <h1 className="mt-3 font-serif text-4xl font-light text-stone-900">Guest policies</h1>
        <p className="mt-4 text-stone-600">
          Plain-language terms for your Bethel visitor stay.{" "}
          <Link href="/book" className="font-medium text-sage-700 underline-offset-2 hover:underline">
            Request your stay
          </Link>{" "}
          when you are ready.
        </p>

        <section className="mt-12 rounded-2xl border border-stone-200 bg-white p-8">
          <h2 className="text-lg font-medium text-stone-900">Check-in &amp; check-out</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">{CHECK_IN_OUT_NOTE}</p>
          <p className="mt-3 text-sm text-stone-600">
            Exact arrival details, parking, and entry instructions are shared after your reservation
            is approved and confirmed.
          </p>
        </section>

        {POLICY_SECTIONS.map((section) => (
          <section
            key={section.title}
            className="mt-8 rounded-2xl border border-stone-200 bg-white p-8"
          >
            <h2 className="text-lg font-medium text-stone-900">{section.title}</h2>
            {section.summary ? (
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{section.summary}</p>
            ) : null}
            <ul className="mt-4 space-y-2 text-sm text-stone-600">
              {section.bullets.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
