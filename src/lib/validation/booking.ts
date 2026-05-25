import type { BookingRequestFormData } from "@/types/reservation";

export interface FieldError {
  field: keyof BookingRequestFormData;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 86400000));
}

export function calculateRetreatPricing(guestCount: number, nights: number) {
  const extraGuests = Math.max(0, guestCount - 2);
  const nightly = 150 + extraGuests * 25;
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
  if (!data.checkIn) errors.push({ field: "checkIn", message: "Check-in is required." });
  if (!data.checkOut) errors.push({ field: "checkOut", message: "Check-out is required." });
  if (data.checkIn && data.checkOut) {
    const nights = calculateNights(data.checkIn, data.checkOut);
    if (nights <= 0) errors.push({ field: "checkOut", message: "Check-out must be after check-in." });
    if (data.checkIn < todayISO()) errors.push({ field: "checkIn", message: "Check-in cannot be in the past." });
  }
  const guests = parseInt(data.guestCount, 10);
  if (!data.guestCount || isNaN(guests) || guests < 1) {
    errors.push({ field: "guestCount", message: "Guest count is required." });
  } else if (guests > maxGuests) {
    errors.push({ field: "guestCount", message: `Maximum ${maxGuests} guests.` });
  }
  return errors;
}
