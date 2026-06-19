import type { Metadata } from "next";
import Link from "next/link";
import { BookingRequestForm } from "@/components/public/booking-request-form";
import { CHECK_IN_OUT_NOTE } from "@/lib/content/policies";
import { pageMetadata } from "@/lib/content/site-metadata";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbSchema,
  roomOffersSchema,
  stayOfferSchema,
} from "@/lib/seo/json-ld";

export const metadata: Metadata = pageMetadata({
  title: "Reserve Your Stay",
  description:
    "Request your stay at Tuxedo Retreat — host-reviewed reservations, secure payment after approval.",
  path: "/book",
});

export default function BookPage() {
  return (
    <div className="bg-gradient-to-b from-stone-100 via-stone-50 to-sage-50/30 pt-28 pb-24">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Book", path: "/book" },
          ]),
          roomOffersSchema(),
          stayOfferSchema({
            name: "Tuxedo Retreat nightly stay",
            description: "Host-reviewed reservation request — payment after approval.",
            price: 150,
            url: "/book",
          }),
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
            Reservation request
          </p>
          <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-stone-900 md:text-5xl">
            Request your stay
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-600">
            A private retreat minutes from Warwick Bethel. Submit your preferred dates — our host
            personally reviews every request before inviting you to pay.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">{CHECK_IN_OUT_NOTE}</p>
          <p className="mt-3 text-sm text-stone-500">
            Prefer to browse first?{" "}
            <Link href="/availability" className="font-medium text-sage-700 underline-offset-2 hover:underline">
              Check the live calendar
            </Link>{" "}
            or read our{" "}
            <Link href="/policies" className="font-medium text-sage-700 underline-offset-2 hover:underline">
              guest policies
            </Link>
            .
          </p>
        </div>

        <div className="mt-12">
          <BookingRequestForm />
        </div>
      </div>
    </div>
  );
}
