import type { Metadata } from "next";
import { AvailabilityCalendar } from "@/components/public/availability-calendar";

export const metadata: Metadata = {
  title: "Availability",
  description:
    "See available, pending, booked, and blocked dates — select your stay and request reservation.",
};

export default function AvailabilityPage() {
  return (
    <div className="bg-gradient-to-b from-stone-100 via-stone-50 to-stone-50 pt-28 pb-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
          Plan your retreat
        </p>
        <h1 className="mt-3 text-center font-serif text-4xl font-light text-stone-900 md:text-5xl">
          Availability
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
          Live calendar from our reservation system — confirmed stays and host blocks are protected.
          Pending requests are shown so you know what is in review. Select open dates and continue to
          your reservation request.
        </p>
        <div className="mt-12">
          <AvailabilityCalendar />
        </div>
      </div>
    </div>
  );
}
