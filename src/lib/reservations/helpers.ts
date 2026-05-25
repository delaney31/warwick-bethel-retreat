import {
  calculateStayPricing,
  EXTRA_GUEST_NIGHTLY,
  getBaseRateForPackage,
  GUESTS_INCLUDED,
  StayPackage,
  type StayPackageId,
  type StayPricing,
} from "@/lib/pricing/stay-packages";

/** @deprecated Use getBaseRateForPackage(StayPackage.MAIN_BEDROOM) */
export const DEFAULT_BASE_RATE = getBaseRateForPackage(StayPackage.MAIN_BEDROOM);
export const DEFAULT_EXTRA_GUEST_NIGHTLY = EXTRA_GUEST_NIGHTLY;
export { GUESTS_INCLUDED };

export type ReservationPricing = StayPricing;

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

export function calculateReservationTotal(
  guestCount: number,
  checkIn: string,
  checkOut: string,
  stayPackage: StayPackageId = StayPackage.MAIN_BEDROOM,
): ReservationPricing | null {
  return calculateStayPricing(guestCount, checkIn, checkOut, stayPackage);
}
