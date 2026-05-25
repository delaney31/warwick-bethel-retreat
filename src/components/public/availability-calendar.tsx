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
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { fetchBookingCalendar, isBookingApiError } from "@/lib/api/booking-public";
import {
  buildDayStatusMap,
  DAY_STATUS_LABELS,
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

const LEGEND: Array<{ status: DayAvailabilityStatus; hint: string }> = [
  { status: "available", hint: "Open nights you can request" },
  { status: "pending_review", hint: "Another guest request under host review" },
  { status: "approved_awaiting", hint: "Approved stay awaiting payment — dates not locked yet" },
  { status: "booked", hint: "Confirmed paid stay — cannot select" },
  { status: "blocked", hint: "Host hold — cannot select" },
];

const STATUS_STYLES: Record<
  DayAvailabilityStatus,
  { cell: string; dot: string; abbrev: string }
> = {
  available: {
    cell: "bg-white text-stone-800 border-stone-200/90 hover:border-sage-400 hover:bg-sage-50/50",
    dot: "bg-white ring-1 ring-stone-300",
    abbrev: "",
  },
  pending_review: {
    cell: "bg-amber-50 text-amber-950 border-amber-200/90",
    dot: "bg-amber-300 ring-1 ring-amber-500/50",
    abbrev: "PR",
  },
  approved_awaiting: {
    cell: "bg-sky-50 text-sky-950 border-sky-200/90",
    dot: "bg-sky-300 ring-1 ring-sky-500/50",
    abbrev: "AP",
  },
  booked: {
    cell: "bg-stone-800 text-stone-100 border-stone-800 cursor-not-allowed",
    dot: "bg-stone-700 ring-1 ring-stone-900",
    abbrev: "",
  },
  blocked: {
    cell: "bg-stone-200/80 text-stone-500 border-stone-300 cursor-not-allowed",
    dot: "bg-stone-400 ring-1 ring-stone-500/40",
    abbrev: "",
  },
};

function formatDisplayDate(iso: string) {
  return format(parseISO(iso), "MMM d, yyyy");
}

function calendarFetchRange(viewMonth: Date) {
  const from = format(startOfMonth(subMonths(viewMonth, 1)), "yyyy-MM-dd");
  const to = format(endOfMonth(addMonths(viewMonth, 2)), "yyyy-MM-dd");
  return { from, to };
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
    const { from, to } = calendarFetchRange(month);
    setLoading(true);
    setLoadError(null);
    fetchBookingCalendar(from, to)
      .then((data) => {
        if (isBookingApiError(data)) {
          setLoadError(data.error);
          setDayStatus(new Map());
          return;
        }
        if (!data.configured) {
          setLoadError(
            "Live calendar is unavailable — the reservation database is not connected.",
          );
          setDayStatus(new Map());
          return;
        }
        setDayStatus(buildDayStatusMap(data));
      })
      .catch(() => {
        setLoadError("Could not load availability from our reservation system. Please refresh.");
        setDayStatus(new Map());
      })
      .finally(() => setLoading(false));
  }, [month]);

  const interval = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }),
    [month],
  );

  const rangeValid = useMemo(() => {
    if (!checkIn || !checkOut || loadError) return false;
    return isStayRangeValid(dayStatus, checkIn, checkOut, today);
  }, [checkIn, checkOut, dayStatus, today, loadError]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut || !rangeValid) return 0;
    return Math.max(
      0,
      Math.floor((parseISO(checkOut).getTime() - parseISO(checkIn).getTime()) / 86400000),
    );
  }, [checkIn, checkOut, rangeValid]);

  const bookHref = useMemo(() => {
    if (!rangeValid || !checkIn || !checkOut) return null;
    const params = new URLSearchParams({ checkIn, checkOut });
    return `/book?${params.toString()}`;
  }, [checkIn, checkOut, rangeValid]);

  const handleDayClick = useCallback(
    (isoDate: string) => {
      if (loading || loadError) return;
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
          "Your stay cannot include booked or blocked nights. Choose a shorter range or different dates.",
        );
        return;
      }

      setCheckOut(isoDate);
    },
    [checkIn, checkOut, dayStatus, today, loading, loadError],
  );

  const clearSelection = () => {
    setCheckIn(null);
    setCheckOut(null);
    setRangeError(null);
  };

  const canNavigate = !loading;

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200/60 bg-gradient-to-b from-white/98 to-stone-50/95 shadow-xl shadow-stone-900/5">
      <div className="border-b border-stone-200/50 bg-stone-900/[0.02] px-4 py-5 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label="Previous month"
            disabled={!canNavigate}
            onClick={() => setMonth((m) => subMonths(m, 1))}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-200/80 bg-white/90 text-stone-600 transition hover:border-sage-300 hover:text-sage-800 disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-sage-600">
              Live availability
            </p>
            <h3 className="mt-1 font-serif text-2xl font-light tracking-tight text-stone-900 sm:text-3xl">
              {format(month, "MMMM yyyy")}
            </h3>
            {loading && (
              <p className="mt-2 flex items-center justify-center gap-2 text-xs text-stone-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                Loading from database…
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Next month"
            disabled={!canNavigate}
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-200/80 bg-white/90 text-stone-600 transition hover:border-sage-300 hover:text-sage-800 disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-8">
        <div
          className="grid gap-2 rounded-2xl border border-stone-200/50 bg-white/60 p-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2 sm:p-4 lg:grid-cols-3"
          role="list"
          aria-label="Calendar legend"
        >
          {LEGEND.map(({ status, hint }) => (
            <div
              key={status}
              role="listitem"
              className="flex items-start gap-2.5"
              title={hint}
            >
              <span
                className={cn(
                  "mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full",
                  STATUS_STYLES[status].dot,
                )}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-800">
                  {DAY_STATUS_LABELS[status]}
                </p>
                <p className="text-[11px] leading-snug text-stone-500">{hint}</p>
              </div>
            </div>
          ))}
        </div>

        {loadError && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            {loadError}
          </p>
        )}

        <div
          className={cn("mt-5", loading && "pointer-events-none opacity-60")}
          aria-busy={loading}
        >
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="pb-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-stone-400"
              >
                <span className="hidden sm:inline">{d}</span>
                <span className="sm:hidden">{d.slice(0, 1)}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {Array.from({ length: interval[0].getDay() }).map((_, i) => (
              <div key={`pad-${i}`} aria-hidden className="aspect-square min-h-[2.5rem]" />
            ))}
            {interval.map((date) => {
              const key = format(date, "yyyy-MM-dd");
              const status = getDayStatus(dayStatus, key);
              const past = isPastDate(key, today);
              const selectable = !past && isDaySelectable(dayStatus, key, today);
              const inRange = isDateInStayRange(key, checkIn, checkOut);
              const isStart = isRangeStart(key, checkIn);
              const isEnd = isRangeEnd(key, checkOut);
              const disabled =
                past || status === "booked" || status === "blocked" || Boolean(loadError);
              const label = DAY_STATUS_LABELS[status];
              const abbrev = STATUS_STYLES[status].abbrev;

              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled || loading}
                  onClick={() => handleDayClick(key)}
                  aria-label={`${format(date, "EEEE, MMMM d")}, ${label}${inRange ? ", selected" : ""}`}
                  aria-pressed={inRange || isStart || isEnd}
                  className={cn(
                    "relative flex aspect-square min-h-[2.5rem] flex-col items-center justify-center rounded-lg border text-sm font-medium transition-all sm:min-h-[2.85rem] sm:rounded-xl sm:text-base",
                    STATUS_STYLES[status].cell,
                    !isSameMonth(date, month) && "opacity-30",
                    inRange && !isStart && !isEnd && "border-sage-400/80 bg-sage-100 text-sage-900",
                    (isStart || isEnd) &&
                      "z-10 border-sage-700 bg-sage-700 text-white shadow-md ring-2 ring-sage-300/60 ring-offset-1",
                    selectable && !inRange && !disabled && "active:scale-[0.96]",
                    disabled && "opacity-55",
                    status === "blocked" && "bg-[repeating-linear-gradient(-45deg,#e7e5e4,#e7e5e4_4px,#d6d3d1_4px,#d6d3d1_8px)]",
                  )}
                >
                  <span className="leading-none tabular-nums">{format(date, "d")}</span>
                  {abbrev && !inRange && !past && (
                    <span className="mt-0.5 text-[8px] font-bold uppercase tracking-tighter opacity-80 sm:text-[9px]">
                      {abbrev}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-stone-500">
          Tap your <strong className="font-medium text-stone-700">check-in</strong>, then your{" "}
          <strong className="font-medium text-stone-700">check-out</strong>. Booked and blocked
          nights cannot be part of your stay. Pending and approved stays are shown for transparency
          but do not lock dates until payment is confirmed.
        </p>
      </div>

      <div className="border-t border-stone-200/50 bg-white/50 px-4 py-6 sm:px-8">
        {checkIn && (
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
              Selected stay
            </p>
            <p className="mt-2 font-serif text-lg text-stone-900 sm:text-xl">
              {formatDisplayDate(checkIn)}
              {checkOut ? (
                <>
                  <span className="mx-2 font-sans text-stone-400">→</span>
                  {formatDisplayDate(checkOut)}
                </>
              ) : (
                <span className="ml-2 text-sm font-sans font-normal text-stone-500">
                  — select check-out
                </span>
              )}
            </p>
            {rangeValid && nights > 0 && (
              <p className="mt-1 text-sm font-medium text-sage-700">
                {nights} night{nights !== 1 ? "s" : ""} · ready to request
              </p>
            )}
          </div>
        )}

        {rangeError && (
          <p role="alert" className="mt-3 text-center text-sm text-red-700">
            {rangeError}
          </p>
        )}

        <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          {(checkIn || checkOut) && (
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={clearSelection}
              className="order-2 sm:order-1"
            >
              Clear dates
            </Button>
          )}
          {bookHref ? (
            <Button
              href={bookHref}
              size="lg"
              className="order-1 w-full sm:order-2 sm:min-w-[260px]"
            >
              Request these dates
            </Button>
          ) : (
            <Button
              size="lg"
              disabled
              className="order-1 w-full sm:order-2 sm:min-w-[260px]"
            >
              {checkIn && !checkOut ? "Select check-out" : "Request these dates"}
            </Button>
          )}
        </div>

        {!checkIn && !loading && !loadError && (
          <p className="mt-4 text-center text-[11px] text-stone-400">
            Data loaded from PostgreSQL — confirmed paid stays and host blocks prevent double
            booking.
          </p>
        )}
      </div>
    </div>
  );
}
