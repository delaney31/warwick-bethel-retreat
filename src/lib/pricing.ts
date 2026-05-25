import { differenceInCalendarDays, parseISO } from "date-fns";

export interface PricingInput {
  checkIn: string;
  checkOut: string;
  guestCount: number;
  baseRateCents: number;
  extraGuestCents: number;
  sleepsIncluded: number;
}

export interface PricingResult {
  nights: number;
  baseRateCents: number;
  extraGuestCents: number;
  extraGuests: number;
  subtotalCents: number;
  totalCents: number;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = parseISO(checkIn);
  const end = parseISO(checkOut);
  const nights = differenceInCalendarDays(end, start);
  return Math.max(0, nights);
}

export function calculatePricing(input: PricingInput): PricingResult | null {
  const nights = calculateNights(input.checkIn, input.checkOut);
  if (nights <= 0) return null;

  const extraGuests = Math.max(0, input.guestCount - input.sleepsIncluded);
  const nightlyBase = input.baseRateCents;
  const nightlyExtra = extraGuests * input.extraGuestCents;
  const subtotalCents = (nightlyBase + nightlyExtra) * nights;

  return {
    nights,
    baseRateCents: input.baseRateCents,
    extraGuestCents: input.extraGuestCents,
    extraGuests,
    subtotalCents,
    totalCents: subtotalCents,
  };
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
