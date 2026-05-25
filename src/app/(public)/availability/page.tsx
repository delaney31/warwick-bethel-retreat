import type { Metadata } from "next";
import { AvailabilityCalendar } from "@/components/public/availability-calendar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Availability",
  description: "Interactive calendar — see booked, pending, and available dates.",
};

export default function AvailabilityPage() {
  return (
    <div className="bg-stone-50 pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600">Calendar</p>
        <h1 className="mt-3 font-serif text-4xl font-light text-stone-900">Availability</h1>
        <p className="mt-4 text-stone-600">
          Real-time calendar with overbooking prevention. Submit a request for open dates.
        </p>
        <div className="mt-10">
          <AvailabilityCalendar />
        </div>
        <div className="mt-10 text-center">
          <Button href="/book" size="lg">Request These Dates</Button>
        </div>
      </div>
    </div>
  );
}
