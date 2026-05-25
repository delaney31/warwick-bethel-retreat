import type { FieldError } from "@/lib/validation/booking";

export interface BookingQuote {
  nights: number;
  guestCount: number;
  baseRatePerNight: number;
  baseStayTotal: number;
  extraGuests: number;
  extraGuestFeeTotal: number;
  subtotal: number;
}

export interface BookingSubmitSuccess {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  subtotal: number;
  guestCount: number;
  message: string;
}

export interface BookingApiError {
  error: string;
  fields?: FieldError[];
}

export interface CalendarDayRange {
  start: string;
  end: string;
}

export interface CalendarBlock {
  id: string;
  startDateUtc: string;
  endDateUtc: string;
  reason: string;
}

export interface BookingCalendarData {
  configured: boolean;
  /** PAID_CONFIRMED — not selectable */
  bookedRanges: CalendarDayRange[];
  /** PENDING_REVIEW — visible, selectable */
  pendingReviewRanges: CalendarDayRange[];
  /** APPROVED_AWAITING_PAYMENT — visible, selectable until paid */
  approvedAwaitingRanges: CalendarDayRange[];
  blocks: CalendarBlock[];
}

async function parseJson<T>(res: Response): Promise<T | BookingApiError> {
  const data = (await res.json()) as T | BookingApiError;
  if (!res.ok) return data as BookingApiError;
  return data as T;
}

export async function fetchBookingQuote(body: {
  checkIn: string;
  checkOut: string;
  guestCount: number;
}): Promise<BookingQuote | BookingApiError> {
  const res = await fetch("/api/booking/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson<BookingQuote>(res);
}

export async function fetchBookingAvailability(body: {
  checkIn: string;
  checkOut: string;
}): Promise<{ isAvailable: boolean; reason?: string } | BookingApiError> {
  const res = await fetch("/api/booking/availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson<{ isAvailable: boolean; reason?: string }>(res);
}

export async function submitBookingRequest(body: {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  guestNotes: string;
}): Promise<BookingSubmitSuccess | BookingApiError> {
  const res = await fetch("/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson<BookingSubmitSuccess>(res);
}

export async function fetchBookingCalendar(
  from: string,
  to: string,
): Promise<BookingCalendarData | BookingApiError> {
  const params = new URLSearchParams({ from, to });
  const res = await fetch(`/api/booking/calendar?${params}`, { cache: "no-store" });
  return parseJson<BookingCalendarData>(res);
}

export function isBookingApiError(
  result: unknown,
): result is BookingApiError {
  return Boolean(result && typeof result === "object" && "error" in result);
}
