"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfToday,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchBookingCalendar, isBookingApiError } from "@/lib/api/booking-public";
import {
  buildDayStatusMap,
  getDayStatus,
  isDateInStayRange,
  isDaySelectable,
  isPastDate,
  isRangeEnd,
  isRangeStart,
  isStayRangeValid,
  type DayAvailabilityStatus,
} from "@/lib/calendar/availability-map";
import { todayISO } from "@/lib/validation/booking";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const LEGEND: Array<{ status: DayAvailabilityStatus; label: string; hint: string }> = [
  { status: "available", label: "Available", hint: "Open for your stay" },
  { status: "pending", label: "Pending review", hint: "Request in progress — you may still inquire" },
  { status: "booked", label: "Booked", hint: "Confirmed guest — not selectable" },
  { status: "blocked", label: "Blocked", hint: "Host hold — not selectable" },
];

const STATUS_STYLES: Record<
  DayAvailabilityStatus,
  { cell: string; dot: string }
> = {
  available: {
    cell: "bg-white/90 text-stone-800 border-stone-200/80 hover:border-sage-400 hover:shadow-sm",
    dot: "bg-white border border-stone-300",
  },
  pending: {
    cell: "bg-amber-50/90 text-amber-950 border-amber-200/90",
    dot: "bg-amber-200 border border-amber-400",
  },
  booked: {
    cell: "bg-stone-800 text-stone-100 border-stone-800 cursor-not-allowed",
    dot: "bg-stone-800",
  },
  blocked: {
    cell: "bg-stone-200/90 text-stone-500 border-stone-300 cursor-not-allowed line-through decoration-stone-400/60",
    dot: "bg-stone-300 border border-stone-400",
  },
};

function formatDisplayDate(iso: string) {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function AvailabilityCalendar() {
  const today = todayISO();
  const [month, setMonth] = useState(() => startOfMonth(startOfToday()));
  const [dayStatus, setDayStatus] = useState<Map<string, DayAvailabilityStatus>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [rangeError, setRangeError] = useState<string | null>(null);

  useEffect(() => {
    const from = format(startOfMonth(month), "yyyy-MM-dd");
    const to = format(endOfMonth(addMonths(month, 1)), "yyyy-MM-dd");
    setLoading(true);
    setLoadError(null);
    fetchBookingCalendar(from, to)
      .then((data) => {
        if (isBookingApiError(data)) {
          setLoadError(data.error);
          return;
        }
        setDayStatus(buildDayStatusMap(data));
      })
      .catch(() => setLoadError("Could not load availability. Please refresh the page."))
      .finally(() => setLoading(false));
  }, [month]);

  const interval = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }),
    [month],
  );

  const rangeValid = useMemo(() => {
    if (!checkIn || !checkOut) return false;
    return isStayRangeValid(dayStatus, checkIn, checkOut, today);
  }, [checkIn, checkOut, dayStatus, today]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut || !rangeValid) return 0;
    return Math.max(0, Math.floor((parseISO(checkOut).getTime() - parseISO(checkIn).getTime()) / 86400000));
  }, [checkIn, checkOut, rangeValid]);

  const bookHref = useMemo(() => {
    if (!rangeValid || !checkIn || !checkOut) return null;
    const params = new URLSearchParams({ checkIn, checkOut });
    return `/book?${params.toString()}`;
  }, [checkIn, checkOut, rangeValid]);

  const handleDayClick = useCallback(
    (isoDate: string) => {
      setRangeError(null);
      if (!isDaySelectable(dayStatus, isoDate, today)) return;

      if (!checkIn || (checkIn && checkOut)) {
        setCheckIn(isoDate);
        setCheckOut(null);
        return;
      }

      if (isoDate <= checkIn) {
        setCheckIn(isoDate);
        setCheckOut(null);
        return;
      }

      if (!isStayRangeValid(dayStatus, checkIn, isoDate, today)) {
        setRangeError(
          "That stay includes booked or blocked nights. Choose different dates or a shorter range.",
        );
        return;
      }

      setCheckOut(isoDate);
    },
    [checkIn, checkOut, dayStatus, today],
  );

  const clearSelection = () => {
    setCheckIn(null);
    setCheckOut(null);
    setRangeError(null);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200/60 bg-gradient-to-b from-white/95 to-stone-50/90 shadow-xl shadow-stone-900/5">
      <div className="border-b border-stone-200/50 bg-stone-900/[0.02] px-4 py-5 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setMonth((m) => subMonths(m, 1))}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-200/80 bg-white/80 text-stone-600 transition hover:border-sage-300 hover:text-sage-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-sage-600">
              Select your stay
            </p>
            <h3 className="mt-1 font-serif text-2xl font-light tracking-tight text-stone-900 sm:text-3xl">
              {format(month, "MMMM yyyy")}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-200/80 bg-white/80 text-stone-600 transition hover:border-sage-300 hover:text-sage-800"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-8">
        <div
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-2xl border border-stone-200/50 bg-white/50 px-4 py-3"
          role="list"
          aria-label="Calendar legend"
        >
          {LEGEND.map(({ status, label, hint }) => (
            <div
              key={status}
              role="listitem"
              className="flex items-center gap-2"
              title={hint}
            >
              <span
                className={cn("h-3 w-3 shrink-0 rounded-full", STATUS_STYLES[status].dot)}
                aria-hidden
              />
              <span className="text-xs font-medium text-stone-600">{label}</span>
            </div>
          ))}
        </div>

        {loadError && (
          <p className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {loadError}
          </p>
        )}

        <div className="mt-5 grid grid-cols-7 gap-1 sm:gap-1.5">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wider text-stone-400"
            >
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{d.slice(0, 1)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {Array.from({ length: interval[0].getDay() }).map((_, i) => (
            <div key={`pad-${i}`} aria-hidden className="min-h-[2.75rem] sm:min-h-[3rem]" />
          ))}
          {interval.map((date) => {
            const key = format(date, "yyyy-MM-dd");
            const status = getDayStatus(dayStatus, key);
            const past = isPastDate(key, today);
            const selectable = !past && isDaySelectable(dayStatus, key, today);
            const inRange = isDateInStayRange(key, checkIn, checkOut);
            const isStart = isRangeStart(key, checkIn);
            const isEnd = isRangeEnd(key, checkOut);
            const disabled = past || status === "booked" || status === "blocked";

            return (
              <button
                key={key}
                type="button"
                disabled={disabled || loading}
                onClick={() => handleDayClick(key)}
                aria-label={`${format(date, "EEEE, MMMM d")}, ${LEGEND.find((l) => l.status === status)?.label ?? status}${inRange ? ", selected" : ""}`}
                aria-pressed={inRange || isStart || isEnd}
                className={cn(
                  "relative flex min-h-[2.75rem] flex-col items-center justify-center rounded-xl border text-sm font-medium transition-all sm:min-h-[3rem] sm:text-base",
                  !isSameMonth(date, month) && "opacity-40",
                  STATUS_STYLES[status].cell,
                  loading && "animate-pulse",
                  inRange && !isStart && !isEnd && "border-sage-300/80 bg-sage-100/90 text-sage-900",
                  (isStart || isEnd) && "z-10 border-sage-600 bg-sage-700 text-white shadow-md ring-2 ring-sage-300/50 ring-offset-1 ring-offset-white",
                  selectable && !inRange && !disabled && "active:scale-[0.97]",
                  disabled && "opacity-60",
                )}
              >
                <span className="leading-none">{format(date, "d")}</span>
                {status === "pending" && !inRange && (
                  <span className="mt-0.5 h-1 w-1 rounded-full bg-amber-500" aria-hidden />
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-center text-xs text-stone-500">
          Tap check-in, then check-out. Booked and blocked nights cannot be included in your stay.
        </p>
      </div>

      <div className="border-t border-stone-200/50 bg-white/40 px-4 py-6 sm:px-8">
        {checkIn && (
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
              Your selection
            </p>
            <p className="mt-2 font-serif text-lg text-stone-900 sm:text-xl">
              {formatDisplayDate(checkIn)}
              {checkOut ? (
                <>
                  <span className="mx-2 font-sans text-stone-400">→</span>
                  {formatDisplayDate(checkOut)}
                </>
              ) : (
                <span className="ml-2 text-sm font-sans text-stone-500">— choose check-out</span>
              )}
            </p>
            {rangeValid && nights > 0 && (
              <p className="mt-1 text-sm text-sage-700">
                {nights} night{nights !== 1 ? "s" : ""} · ready to request
              </p>
            )}
          </div>
        )}

        {rangeError && (
          <p className="mt-3 text-center text-sm text-red-700">{rangeError}</p>
        )}

        <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          {(checkIn || checkOut) && (
            <Button type="button" variant="ghost" size="md" onClick={clearSelection} className="order-2 sm:order-1">
              Clear dates
            </Button>
          )}
          {bookHref ? (
            <Button href={bookHref} size="lg" className="order-1 w-full sm:order-2 sm:w-auto sm:min-w-[240px]">
              Request these dates
            </Button>
          ) : (
            <Button size="lg" disabled className="order-1 w-full sm:order-2 sm:w-auto sm:min-w-[240px]">
              Request these dates
            </Button>
          )}
        </div>

        {!checkIn && !loading && !loadError && (
          <p className="mt-4 text-center text-xs text-stone-400">
            Calendar reflects live reservations and host blocks from our database.
          </p>
        )}
      </div>
    </div>
  );
}
