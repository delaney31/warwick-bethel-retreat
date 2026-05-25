"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Bath, BedDouble, Calendar, Check, MapPin, Shield, Trees } from "lucide-react";
import type { BookingQuote } from "@/lib/api/booking-public";
import { formatCurrency } from "@/lib/validation/booking";
import { cn } from "@/lib/utils/cn";

const TRUST_POINTS = [
  { icon: MapPin, text: "15 minutes from Warwick Bethel" },
  { icon: Trees, text: "Private wooded retreat" },
  { icon: BedDouble, text: "2 bedrooms" },
  { icon: Bath, text: "1.5 bathrooms" },
  { icon: Shield, text: "Secure payment after approval" },
] as const;

type AvailabilityUi =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "available"; message?: string }
  | { status: "unavailable"; reason: string }
  | { status: "error"; message: string; softFail?: boolean };

function formatDateLabel(iso: string) {
  try {
    return format(parseISO(iso), "EEE, MMM d, yyyy");
  } catch {
    return iso;
  }
}

export function StaySummaryCard({
  checkIn,
  checkOut,
  guestCount,
  quote,
  quoteLoading,
  availability,
}: {
  checkIn: string;
  checkOut: string;
  guestCount: string;
  quote: BookingQuote | null;
  quoteLoading: boolean;
  availability: AvailabilityUi;
}) {
  const hasDates = Boolean(checkIn && checkOut);
  const guests = parseInt(guestCount, 10) || 0;

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-3xl border border-stone-200/70 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-800 text-white shadow-2xl shadow-stone-900/20">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-400/90">
            Stay summary
          </p>
          <h2 className="mt-2 font-serif text-2xl font-light tracking-tight">Warwick Bethel Retreat</h2>
          <p className="mt-1 text-sm text-white/50">1.5 bathrooms · woodland setting</p>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Dates</p>
            {hasDates ? (
              <div className="mt-2 flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/80" aria-hidden />
                <div className="text-sm leading-relaxed">
                  <p>{formatDateLabel(checkIn)}</p>
                  <p className="text-white/40">to</p>
                  <p>{formatDateLabel(checkOut)}</p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-white/50">
                Select check-in and check-out, or{" "}
                <Link href="/availability" className="text-amber-400/90 underline-offset-2 hover:underline">
                  pick dates on the calendar
                </Link>
                .
              </p>
            )}
          </div>

          {hasDates && guests > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Guests</span>
              <span className="font-medium">
                {guests} guest{guests !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="border-t border-white/10 pt-5">
            {quoteLoading && (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 w-2/3 rounded bg-white/10" />
                <div className="h-8 w-1/2 rounded bg-white/10" />
              </div>
            )}

            {!quoteLoading && quote && (
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">
                    {formatCurrency(quote.baseRatePerNight)}/night
                    <span className="block text-[11px] text-white/35">includes 2 guests</span>
                  </dt>
                  <dd className="text-right font-medium">
                    {formatCurrency(quote.baseStayTotal)}
                    <span className="block text-[11px] font-normal text-white/40">
                      × {quote.nights} night{quote.nights !== 1 ? "s" : ""}
                    </span>
                  </dd>
                </div>
                {quote.extraGuests > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">
                      Extra guests
                      <span className="block text-[11px] text-white/35">
                        +$25/night × {quote.extraGuests}
                      </span>
                    </dt>
                    <dd className="font-medium">{formatCurrency(quote.extraGuestFeeTotal)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-t border-white/10 pt-4">
                  <dt className="font-medium text-white/80">Estimated total</dt>
                  <dd className="font-serif text-2xl font-light text-amber-300">
                    {formatCurrency(quote.subtotal)}
                  </dd>
                </div>
              </dl>
            )}

            {!quoteLoading && hasDates && !quote && (
              <p className="text-sm text-white/50">
                {availability.status === "available"
                  ? "Couldn't load your estimate — try refreshing the page."
                  : "Enter valid dates to see your estimate."}
              </p>
            )}
          </div>

          {hasDates && availability.status !== "idle" && (
            <div
              className={cn(
                "rounded-xl px-4 py-3 text-sm",
                availability.status === "available" && "bg-sage-900/40 text-sage-100",
                availability.status === "unavailable" && "bg-red-950/50 text-red-100",
                (availability.status === "loading" ||
                  availability.status === "error") &&
                  "bg-white/5 text-white/70",
              )}
            >
              {availability.status === "loading" && "Checking calendar…"}
              {availability.status === "available" && (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-sage-300" />
                  {availability.message ?? "Dates appear open on our calendar"}
                </span>
              )}
              {availability.status === "unavailable" && availability.reason}
              {availability.status === "error" && availability.message}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 bg-white/[0.03] px-6 py-5">
          <p className="text-sm leading-relaxed text-white/60">
            Your request is reviewed by the host before payment. Dates are confirmed after approval
            and full payment.
          </p>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {TRUST_POINTS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm text-stone-600">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            {text}
          </li>
        ))}
      </ul>
    </aside>
  );
}
