import { MAX_GUESTS } from "@/lib/constants";
import type { FieldError } from "@/lib/validation/booking";
import { validateBookingForm } from "@/lib/validation/booking";
import {
  calculateReservationTotal,
  checkAvailabilityForStay,
  createReservationRequest,
  getCalendarApiPayload,
  serializeReservation,
  type PublicCalendarPayload,
} from "@/lib/reservations";

export const BOOKING_BASE_RATE = 150;
export const BOOKING_EXTRA_GUEST_RATE = 25;
export const BOOKING_GUESTS_INCLUDED = 2;

export interface BookingPayload {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  guestNotes: string;
}

export interface QuoteResult {
  nights: number;
  guestCount: number;
  baseRatePerNight: number;
  baseStayTotal: number;
  extraGuests: number;
  extraGuestFeeTotal: number;
  subtotal: number;
}

export interface BookingSuccessResult {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  subtotal: number;
  guestCount: number;
  message: string;
}

export function parseBookingBody(body: unknown): BookingPayload | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body." };
  }
  const b = body as Record<string, unknown>;
  const guestCount =
    typeof b.guestCount === "number"
      ? b.guestCount
      : parseInt(String(b.guestCount ?? ""), 10);

  return {
    guestName: String(b.guestName ?? "").trim(),
    guestEmail: String(b.guestEmail ?? "").trim(),
    guestPhone: String(b.guestPhone ?? "").trim(),
    checkIn: String(b.checkIn ?? "").trim(),
    checkOut: String(b.checkOut ?? "").trim(),
    guestCount: Number.isFinite(guestCount) ? guestCount : NaN,
    guestNotes: String(b.guestNotes ?? "").trim(),
  };
}

export function validateBookingPayload(payload: BookingPayload): FieldError[] {
  return validateBookingForm(
    {
      guestName: payload.guestName,
      guestEmail: payload.guestEmail,
      guestPhone: payload.guestPhone,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      guestCount: String(payload.guestCount),
      guestNotes: payload.guestNotes,
    },
    MAX_GUESTS,
  );
}

export function computeQuote(payload: BookingPayload): QuoteResult | { error: string; fields?: FieldError[] } {
  const fieldErrors = validateBookingPayload(payload);
  if (fieldErrors.length) {
    return { error: "Please fix the highlighted fields.", fields: fieldErrors };
  }
  const pricing = calculateReservationTotal(payload.guestCount, payload.checkIn, payload.checkOut);
  if (!pricing) {
    return { error: "Check-out must be after check-in.", fields: [{ field: "checkOut", message: "Check-out must be after check-in." }] };
  }
  return {
    nights: pricing.nights,
    guestCount: payload.guestCount,
    baseRatePerNight: pricing.baseRate,
    baseStayTotal: pricing.baseRate * pricing.nights,
    extraGuests: pricing.extraGuests,
    extraGuestFeeTotal: pricing.extraGuestFee,
    subtotal: pricing.totalAmount,
  };
}

export async function getRetreatCalendar(
  from: string,
  to: string,
): Promise<PublicCalendarPayload | { error: string }> {
  try {
    return await getCalendarApiPayload(from, to);
  } catch {
    return { error: "We could not load the calendar. Please try again." };
  }
}

export async function checkRetreatAvailability(
  checkIn: string,
  checkOut: string,
): Promise<{ isAvailable: boolean; reason?: string } | { error: string }> {
  try {
    return await checkAvailabilityForStay(checkIn, checkOut);
  } catch {
    return { error: "We could not verify availability for those dates. Please try again." };
  }
}

export async function createRetreatReservation(
  payload: BookingPayload,
): Promise<BookingSuccessResult | { error: string; fields?: FieldError[] }> {
  const quote = computeQuote(payload);
  if ("error" in quote) return quote;

  const availability = await checkRetreatAvailability(payload.checkIn, payload.checkOut);
  if ("error" in availability) return availability;
  if (!availability.isAvailable) {
    return {
      error: availability.reason ?? "Those dates are not available. Please choose different dates.",
    };
  }

  try {
    const created = await createReservationRequest({
      guestName: payload.guestName,
      email: payload.guestEmail,
      phone: payload.guestPhone,
      guestCount: payload.guestCount,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      notes: payload.guestNotes || null,
    });

    const row = serializeReservation(created);
    if (!row) {
      return { error: "We could not save your request. Please try again." };
    }

    return {
      id: row.id,
      guestName: row.guestName,
      checkIn: row.checkIn,
      checkOut: row.checkOut,
      nights: row.nights,
      subtotal: row.totalAmount,
      guestCount: row.guestCount,
    message:
      "Request received. We'll review your stay and send payment instructions if approved.",
    };
  } catch {
    return {
      error:
        "We could not submit your request right now. Please try again in a moment, or contact us if this continues.",
    };
  }
}
