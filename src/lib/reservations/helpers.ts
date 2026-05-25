/** Nightly base rate (includes up to 2 guests). */
export const DEFAULT_BASE_RATE = 150;
/** Per-night surcharge per guest above 2. */
export const DEFAULT_EXTRA_GUEST_NIGHTLY = 25;
export const GUESTS_INCLUDED = 2;

export interface ReservationPricing {
  nights: number;
  baseRate: number;
  extraGuestFee: number;
  totalAmount: number;
  extraGuests: number;
}

function parseDateOnly(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Inclusive calendar nights between check-in and check-out (check-out is departure day). */
export function getNights(checkIn: string, checkOut: string): number {
  const start = parseDateOnly(checkIn);
  const end = parseDateOnly(checkOut);
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}

/**
 * True when two half-open stay ranges [start, end) overlap.
 * Used for PAID_CONFIRMED stays and calendar blocks — not pending/unpaid requests.
 */
export function checkDateOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  const a0 = parseDateOnly(aStart).getTime();
  const a1 = parseDateOnly(aEnd).getTime();
  const b0 = parseDateOnly(bStart).getTime();
  const b1 = parseDateOnly(bEnd).getTime();
  return a0 < b1 && b0 < a1;
}

/**
 * Server-authoritative pricing: $150/night (up to 2 guests) + $25/night per extra guest.
 * Returns null when check-out is not after check-in.
 */
export function calculateReservationTotal(
  guestCount: number,
  checkIn: string,
  checkOut: string,
  baseRatePerNight: number = DEFAULT_BASE_RATE,
  extraGuestNightly: number = DEFAULT_EXTRA_GUEST_NIGHTLY,
): ReservationPricing | null {
  const nights = getNights(checkIn, checkOut);
  if (nights <= 0) return null;

  const extraGuests = Math.max(0, guestCount - GUESTS_INCLUDED);
  const basePortion = baseRatePerNight * nights;
  const extraGuestFee = extraGuests * extraGuestNightly * nights;
  const totalAmount = basePortion + extraGuestFee;

  return {
    nights,
    baseRate: baseRatePerNight,
    extraGuestFee,
    totalAmount,
    extraGuests,
  };
}
