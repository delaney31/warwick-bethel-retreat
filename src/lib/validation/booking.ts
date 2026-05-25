import type { BookingRequestFormData } from "@/types/reservation";
import {
  EXTRA_GUEST_NIGHTLY,
  getBaseRateForPackage,
  GUESTS_INCLUDED,
  isStayPackageId,
  StayPackage,
  type StayPackageId,
} from "@/lib/pricing/stay-packages";

export interface FieldError {
  field: keyof BookingRequestFormData;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseIsoDateOnly(iso: string): Date | null {
  if (!ISO_DATE_RE.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
    return null;
  }
  return dt;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = parseIsoDateOnly(checkIn);
  const end = parseIsoDateOnly(checkOut);
  if (!start || !end) return 0;
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 86400000));
}

export function validateStayDates(
  checkIn: string,
  checkOut: string,
): FieldError[] {
  const errors: FieldError[] = [];
  if (!checkIn) {
    errors.push({ field: "checkIn", message: "Check-in is required." });
  } else if (!parseIsoDateOnly(checkIn)) {
    errors.push({ field: "checkIn", message: "Check-in must be a valid date (YYYY-MM-DD)." });
  }
  if (!checkOut) {
    errors.push({ field: "checkOut", message: "Check-out is required." });
  } else if (!parseIsoDateOnly(checkOut)) {
    errors.push({ field: "checkOut", message: "Check-out must be a valid date (YYYY-MM-DD)." });
  }
  if (errors.length) return errors;

  const nights = calculateNights(checkIn, checkOut);
  if (nights <= 0) {
    errors.push({
      field: "checkOut",
      message: "Check-out must be after check-in (at least one night).",
    });
  }
  if (checkIn < todayISO()) {
    errors.push({ field: "checkIn", message: "Check-in cannot be in the past." });
  }
  return errors;
}

/** Quote sidebar — dates, guest count, and stay package (no contact fields required yet). */
export function validateQuoteInput(
  checkIn: string,
  checkOut: string,
  guestCount: number,
  maxGuests: number,
  roomPackage: string,
): FieldError[] {
  const errors = validateStayDates(checkIn, checkOut);
  if (!isStayPackageId(roomPackage)) {
    errors.push({ field: "roomPackage", message: "Choose a stay option." });
  }
  if (!Number.isFinite(guestCount) || guestCount < 1) {
    errors.push({ field: "guestCount", message: "Guest count is required." });
  } else if (guestCount > maxGuests) {
    errors.push({ field: "guestCount", message: `Maximum ${maxGuests} guests.` });
  }
  return errors;
}

export function calculateRetreatPricing(
  guestCount: number,
  nights: number,
  stayPackage: StayPackageId = StayPackage.MAIN_BEDROOM,
) {
  const baseRate = getBaseRateForPackage(stayPackage);
  const extraGuests = Math.max(0, guestCount - GUESTS_INCLUDED);
  const nightly = baseRate + extraGuests * EXTRA_GUEST_NIGHTLY;
  return { nights, nightly, subtotal: nightly * nights, extraGuests };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function validateBookingForm(
  data: BookingRequestFormData,
  maxGuests: number,
): FieldError[] {
  const errors: FieldError[] = [];
  if (!data.guestName.trim()) errors.push({ field: "guestName", message: "Full name is required." });
  if (!data.guestEmail.trim() || !EMAIL_RE.test(data.guestEmail.trim())) {
    errors.push({ field: "guestEmail", message: "A valid email is required." });
  }
  const phoneDigits = data.guestPhone.replace(/\D/g, "");
  if (!data.guestPhone.trim() || phoneDigits.length < 10) {
    errors.push({
      field: "guestPhone",
      message: "A valid phone number is required (at least 10 digits).",
    });
  }
  errors.push(...validateStayDates(data.checkIn, data.checkOut));
  if (!isStayPackageId(data.roomPackage)) {
    errors.push({ field: "roomPackage", message: "Choose a stay option." });
  }
  if (data.guestNotes.length > 2000) {
    errors.push({ field: "guestNotes", message: "Notes must be 2000 characters or fewer." });
  }
  const guests = parseInt(data.guestCount, 10);
  if (!data.guestCount || isNaN(guests) || guests < 1) {
    errors.push({ field: "guestCount", message: "Guest count is required." });
  } else if (guests > maxGuests) {
    errors.push({ field: "guestCount", message: `Maximum ${maxGuests} guests.` });
  }
  return errors;
}
