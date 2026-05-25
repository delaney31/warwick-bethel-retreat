import type { Metadata } from "next";
import { AvailabilityCalendar } from "@/components/public/availability-calendar";
import { pageMetadata } from "@/lib/content/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Availability",
  description:
    "Live availability for Tuxedo Retreat — open, pending, approved, booked, and blocked dates near Warwick Bethel.",
  path: "/availability",
});

export default function AvailabilityPage() {
  return (
    <div className="bg-gradient-to-b from-stone-100 via-stone-50 to-sage-50/20 pt-28 pb-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
          Plan your retreat
        </p>
        <h1 className="mt-3 text-center font-serif text-4xl font-light tracking-tight text-stone-900 md:text-5xl">
          Availability
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-stone-600">
          Every date reflects live data from our reservation system. Confirmed paid stays and host
          blocks are protected — your request cannot cross those nights. Select check-in and
          check-out, then continue to your reservation request with dates pre-filled.
        </p>
        <div className="mt-10 sm:mt-12">
          <AvailabilityCalendar />
        </div>
      </div>
    </div>
  );
}
