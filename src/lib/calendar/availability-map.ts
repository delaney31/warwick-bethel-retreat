import { addDays, format, parseISO } from "date-fns";
import type { BookingCalendarData } from "@/lib/api/booking-public";

export type DayAvailabilityStatus =
  | "available"
  | "pending_review"
  | "approved_awaiting"
  | "booked"
  | "blocked";

const STATUS_RANK: Record<DayAvailabilityStatus, number> = {
  available: 0,
  pending_review: 1,
  approved_awaiting: 2,
  booked: 3,
  blocked: 4,
};

export const DAY_STATUS_LABELS: Record<DayAvailabilityStatus, string> = {
  available: "Available",
  pending_review: "Pending review",
  approved_awaiting: "Approved awaiting payment",
  booked: "Booked",
  blocked: "Blocked",
};

function higherStatus(
  current: DayAvailabilityStatus | undefined,
  next: DayAvailabilityStatus,
): DayAvailabilityStatus {
  if (!current) return next;
  return STATUS_RANK[next] > STATUS_RANK[current] ? next : current;
}

/** Half-open stay range [start, end) — each night from check-in through day before check-out. */
function applyRange(
  map: Map<string, DayAvailabilityStatus>,
  start: string,
  end: string,
  status: DayAvailabilityStatus,
) {
  let d = parseISO(start);
  const endDate = parseISO(end);
  while (d < endDate) {
    const key = format(d, "yyyy-MM-dd");
    map.set(key, higherStatus(map.get(key), status));
    d = addDays(d, 1);
  }
}

export function buildDayStatusMap(data: BookingCalendarData): Map<string, DayAvailabilityStatus> {
  const map = new Map<string, DayAvailabilityStatus>();

  for (const range of data.pendingReviewRanges) {
    applyRange(map, range.start, range.end, "pending_review");
  }
  for (const range of data.approvedAwaitingRanges) {
    applyRange(map, range.start, range.end, "approved_awaiting");
  }
  for (const range of data.bookedRanges) {
    applyRange(map, range.start, range.end, "booked");
  }
  for (const block of data.blocks) {
    applyRange(
      map,
      block.startDateUtc.slice(0, 10),
      block.endDateUtc.slice(0, 10),
      "blocked",
    );
  }

  return map;
}

export function getDayStatus(
  map: Map<string, DayAvailabilityStatus>,
  isoDate: string,
): DayAvailabilityStatus {
  return map.get(isoDate) ?? "available";
}

/** Nights that must be free for a stay [checkIn, checkOut). */
export function stayNightKeys(checkIn: string, checkOut: string): string[] {
  const keys: string[] = [];
  let d = parseISO(checkIn);
  const end = parseISO(checkOut);
  while (d < end) {
    keys.push(format(d, "yyyy-MM-dd"));
    d = addDays(d, 1);
  }
  return keys;
}

export function isPastDate(isoDate: string, today: string): boolean {
  return isoDate < today;
}

export function isBlockingStatus(status: DayAvailabilityStatus): boolean {
  return status === "booked" || status === "blocked";
}

export function isDaySelectable(
  map: Map<string, DayAvailabilityStatus>,
  isoDate: string,
  today: string,
): boolean {
  if (isPastDate(isoDate, today)) return false;
  return !isBlockingStatus(getDayStatus(map, isoDate));
}

export function isStayRangeValid(
  map: Map<string, DayAvailabilityStatus>,
  checkIn: string,
  checkOut: string,
  today: string,
): boolean {
  if (!checkIn || !checkOut || checkOut <= checkIn) return false;
  for (const key of stayNightKeys(checkIn, checkOut)) {
    if (isPastDate(key, today)) return false;
    if (isBlockingStatus(getDayStatus(map, key))) return false;
  }
  return true;
}

export function isDateInStayRange(
  isoDate: string,
  checkIn: string | null,
  checkOut: string | null,
): boolean {
  if (!checkIn || !checkOut) return false;
  return isoDate >= checkIn && isoDate < checkOut;
}

export function isRangeStart(isoDate: string, checkIn: string | null): boolean {
  return checkIn === isoDate;
}

export function isRangeEnd(isoDate: string, checkOut: string | null): boolean {
  return checkOut === isoDate;
}
