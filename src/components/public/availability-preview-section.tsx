"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { CalendarDays, Loader2 } from "lucide-react";
import { fetchBookingCalendar, isBookingApiError } from "@/lib/api/booking-public";
import { buildDayStatusMap } from "@/lib/calendar/availability-map";
import { todayISO } from "@/lib/validation/booking";
import { Button } from "@/components/ui/button";

export function AvailabilityPreviewSection() {
  const [availableCount, setAvailableCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const viewMonth = startOfMonth(new Date());
    const from = todayISO();
    const to = format(endOfMonth(addMonths(viewMonth, 2)), "yyyy-MM-dd");

    fetchBookingCalendar(from, to)
      .then((data) => {
        if (isBookingApiError(data)) {
          setError(true);
          return;
        }
        const statusMap = buildDayStatusMap(data);
        const open = [...statusMap.values()].filter((s) => s === "available").length;
        setAvailableCount(open);
      })
      .catch((err) => {
        if (isBookingApiError(err)) setError(true);
        else setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="border-y border-stone-200 bg-white py-16 md:py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center md:px-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-700">
          <CalendarDays className="h-5 w-5" strokeWidth={1.25} />
        </span>
        <h2 className="mt-5 font-serif text-2xl font-light text-stone-900 md:text-3xl">
          Check live availability
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600">
          Our calendar reflects confirmed stays, host holds, and open nights in real time — select
          dates on the full calendar, then continue to your reservation request.
        </p>

        <div className="mt-6 min-h-[1.5rem] text-sm font-medium text-stone-800">
          {loading && (
            <span className="inline-flex items-center gap-2 text-stone-500">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Loading calendar…
            </span>
          )}
          {!loading && !error && availableCount !== null && (
            <span>
              {availableCount} open {availableCount === 1 ? "night" : "nights"} in the next three
              months
            </span>
          )}
          {!loading && error && (
            <span className="text-stone-500">Open the calendar for the latest dates</span>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/availability" size="lg">
            View full calendar
          </Button>
          <Link
            href="/book"
            className="text-sm font-medium text-sage-700 underline-offset-2 hover:underline"
          >
            Request your stay →
          </Link>
        </div>
      </div>
    </section>
  );
}
