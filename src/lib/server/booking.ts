import { MAX_GUESTS } from "@/lib/constants";
import {
  getStayPackageLabel,
  parseStayPackageId,
  StayPackage,
  type StayPackageId,
} from "@/lib/pricing/stay-packages";
import type { FieldError } from "@/lib/validation/booking";
import { validateBookingForm, validateQuoteInput } from "@/lib/validation/booking";
import {
  calculateReservationTotal,
  checkAvailabilityForStay,
  createReservationRequest,
  getCalendarApiPayload,
  serializeReservation,
  type PublicCalendarPayload,
} from "@/lib/reservations";
import { notifyHostNewBookingRequest } from "@/lib/sms/notify-booking-request";

export const BOOKING_BASE_RATE = 150;
export const BOOKING_TWO_BEDROOM_RATE = 200;
export const BOOKING_EXTRA_GUEST_RATE = 25;
export const BOOKING_GUESTS_INCLUDED = 2;

export interface BookingPayload {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomPackage: StayPackageId;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  guestNotes: string;
}

export interface QuoteResult {
  nights: number;
  guestCount: number;
  roomPackage: StayPackageId;
  roomPackageLabel: string;
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
  roomPackage: StayPackageId;
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
  const roomPackage = parseStayPackageId(b.roomPackage);
  if (!roomPackage) {
    return { error: "Invalid stay option." };
  }

  return {
    guestName: String(b.guestName ?? "").trim(),
    guestEmail: String(b.guestEmail ?? "").trim(),
    guestPhone: String(b.guestPhone ?? "").trim(),
    roomPackage,
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
      roomPackage: payload.roomPackage,
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
  return computeStayQuote(payload.checkIn, payload.checkOut, payload.guestCount, payload.roomPackage);
}

/** Server-side estimate from stay dates only — used by /api/booking/quote before contact fields are filled. */
export function computeStayQuote(
  checkIn: string,
  checkOut: string,
  guestCount: number,
  roomPackage: StayPackageId = StayPackage.MAIN_BEDROOM,
): QuoteResult | { error: string; fields?: FieldError[] } {
  const fieldErrors = validateQuoteInput(checkIn, checkOut, guestCount, MAX_GUESTS, roomPackage);
  if (fieldErrors.length) {
    return { error: "Please choose valid dates, guests, and stay option.", fields: fieldErrors };
  }
  const pricing = calculateReservationTotal(guestCount, checkIn, checkOut, roomPackage);
  if (!pricing) {
    return {
      error: "Check-out must be after check-in (at least one night).",
      fields: [
        {
          field: "checkOut",
          message: "Check-out must be after check-in (at least one night).",
        },
      ],
    };
  }
  return {
    nights: pricing.nights,
    guestCount,
    roomPackage,
    roomPackageLabel: getStayPackageLabel(roomPackage),
    baseRatePerNight: pricing.baseRate,
    baseStayTotal: pricing.baseRate * pricing.nights,
    extraGuests: pricing.extraGuests,
    extraGuestFeeTotal: pricing.extraGuestFee,
    subtotal: pricing.totalAmount,
  };
}

export function parseQuoteBody(
  body: unknown,
): { checkIn: string; checkOut: string; guestCount: number; roomPackage: StayPackageId } | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body." };
  }
  const b = body as Record<string, unknown>;
  const guestCount =
    typeof b.guestCount === "number" ? b.guestCount : parseInt(String(b.guestCount ?? ""), 10);
  const roomPackage = parseStayPackageId(b.roomPackage);
  if (!roomPackage) {
    return { error: "Invalid stay option." };
  }
  return {
    checkIn: String(b.checkIn ?? "").trim(),
    checkOut: String(b.checkOut ?? "").trim(),
    guestCount: Number.isFinite(guestCount) ? guestCount : NaN,
    roomPackage,
  };
}

export async function getRetreatCalendar(
  from: string,
  to: string,
): Promise<PublicCalendarPayload | { error: string }> {
  try {
    const payload = await getCalendarApiPayload(from, to);
    if (!payload.configured) {
      return {
        error:
          "Calendar is unavailable — reservation database is not connected. Please try again later.",
      };
    }
    return payload;
  } catch (err) {
    console.error("[booking/calendar]", err);
    return { error: "We could not load the calendar. Please try again." };
  }
}

export async function checkRetreatAvailability(
  checkIn: string,
  checkOut: string,
): Promise<{ isAvailable: boolean; reason?: string }> {
  try {
    return await checkAvailabilityForStay(checkIn, checkOut);
  } catch (err) {
    console.error("[booking/availability] database check failed", err);
    // Soft-fail: guest may still submit; host confirms manually if calendar query fails.
    return { isAvailable: true };
  }
}

export async function createRetreatReservation(
  payload: BookingPayload,
): Promise<BookingSuccessResult | { error: string; fields?: FieldError[] }> {
  const quote = computeQuote(payload);
  if ("error" in quote) return quote;

  const availability = await checkRetreatAvailability(payload.checkIn, payload.checkOut);
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
      roomPackage: payload.roomPackage,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      notes: payload.guestNotes || null,
    });

    const row = serializeReservation(created);
    if (!row) {
      return {
        error:
          "We couldn't submit your request. Please check your details and try again.",
      };
    }

    void notifyHostNewBookingRequest({
      guestName: row.guestName,
      phone: payload.guestPhone,
      checkIn: row.checkIn,
      checkOut: row.checkOut,
      nights: row.nights,
      guestCount: row.guestCount,
      roomPackage: row.roomPackage,
    });

    return {
      id: row.id,
      guestName: row.guestName,
      checkIn: row.checkIn,
      checkOut: row.checkOut,
      nights: row.nights,
      subtotal: row.totalAmount,
      guestCount: row.guestCount,
      roomPackage: row.roomPackage,
      message:
        "Your request has been received. We'll review your stay and follow up with payment instructions if approved.",
    };
  } catch {
    return {
      error:
        "We couldn't submit your request. Please check your details and try again.",
    };
  }
}
