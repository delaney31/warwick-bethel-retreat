import { calculateNights } from "@/lib/validation/booking";

export const StayPackage = {
  MAIN_BEDROOM: "MAIN_BEDROOM",
  TWO_BEDROOMS: "TWO_BEDROOMS",
} as const;

export type StayPackageId = (typeof StayPackage)[keyof typeof StayPackage];

export const EXTRA_GUEST_NIGHTLY = 25;
export const GUESTS_INCLUDED = 2;

export const STAY_PACKAGE_OPTIONS = [
  {
    id: StayPackage.MAIN_BEDROOM,
    label: "Main bedroom",
    shortLabel: "1 bedroom",
    description: "Private master suite",
    baseRatePerNight: 150,
  },
  {
    id: StayPackage.TWO_BEDROOMS,
    label: "Two bedrooms",
    shortLabel: "Full cottage",
    description: "Both bedrooms + shared spaces",
    baseRatePerNight: 200,
  },
] as const;

export interface StayPricing {
  nights: number;
  baseRate: number;
  extraGuestFee: number;
  totalAmount: number;
  extraGuests: number;
  stayPackage: StayPackageId;
}

export function isStayPackageId(value: string): value is StayPackageId {
  return value === StayPackage.MAIN_BEDROOM || value === StayPackage.TWO_BEDROOMS;
}

export function parseStayPackageId(value: unknown): StayPackageId | null {
  const normalized = String(value ?? "").trim();
  return isStayPackageId(normalized) ? normalized : null;
}

export function getStayPackageOption(id: StayPackageId) {
  const option = STAY_PACKAGE_OPTIONS.find((p) => p.id === id);
  if (!option) {
    throw new Error(`Unknown stay package: ${id}`);
  }
  return option;
}

export function getBaseRateForPackage(stayPackage: StayPackageId): number {
  return getStayPackageOption(stayPackage).baseRatePerNight;
}

export function getStayPackageLabel(stayPackage: StayPackageId): string {
  return getStayPackageOption(stayPackage).label;
}

/** Server-authoritative pricing for a selected stay package. */
export function calculateStayPricing(
  guestCount: number,
  checkIn: string,
  checkOut: string,
  stayPackage: StayPackageId,
): StayPricing | null {
  const nights = calculateNights(checkIn, checkOut);
  if (nights <= 0) return null;

  const baseRate = getBaseRateForPackage(stayPackage);
  const extraGuests = Math.max(0, guestCount - GUESTS_INCLUDED);
  const basePortion = baseRate * nights;
  const extraGuestFee = extraGuests * EXTRA_GUEST_NIGHTLY * nights;

  return {
    nights,
    baseRate,
    extraGuestFee,
    totalAmount: basePortion + extraGuestFee,
    extraGuests,
    stayPackage,
  };
}

export function formatStayPackageRateLine(stayPackage: StayPackageId): string {
  const option = getStayPackageOption(stayPackage);
  return `$${option.baseRatePerNight}/night for 2 guests · +$${EXTRA_GUEST_NIGHTLY}/night per extra guest`;
}
