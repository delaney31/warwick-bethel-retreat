import { Prisma, ReservationStatus as DbReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export { DbReservationStatus as ReservationDbStatus };

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

export interface CreateReservationInput {
  guestName: string;
  email: string;
  phone: string;
  guestCount: number;
  checkIn: string;
  checkOut: string;
  notes?: string | null;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface MonthAvailability {
  year: number;
  month: number;
  from: string;
  to: string;
  paidReservations: DateRange[];
  calendarBlocks: Array<{
    id: string;
    start: string;
    end: string;
    reason: string;
  }>;
  /** Dates that block new PAID_CONFIRMED bookings (paid stays + manual blocks). */
  blockedRanges: DateRange[];
}

function parseDateOnly(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function toDateOnlyString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function toDecimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

function decimalToNumber(d: Prisma.Decimal): number {
  return d.toNumber();
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

function monthBounds(year: number, month: number): { from: Date; to: Date; fromStr: string; toStr: string } {
  const from = new Date(Date.UTC(year, month - 1, 1));
  const to = new Date(Date.UTC(year, month, 0));
  return {
    from,
    to,
    fromStr: toDateOnlyString(from),
    toStr: toDateOnlyString(to),
  };
}

/** Ranges that block the calendar for guests (paid stays + manual blocks only). */
async function getBlockingRanges(
  rangeStart: string,
  rangeEnd: string,
  excludeReservationId?: string,
): Promise<DateRange[]> {
  const start = parseDateOnly(rangeStart);
  const end = parseDateOnly(rangeEnd);

  const [paid, blocks] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        status: DbReservationStatus.PAID_CONFIRMED,
        checkIn: { lt: end },
        checkOut: { gt: start },
        ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
      },
      select: { checkIn: true, checkOut: true },
    }),
    prisma.calendarBlock.findMany({
      where: {
        startDate: { lt: end },
        endDate: { gt: start },
      },
      select: { startDate: true, endDate: true },
    }),
  ]);

  const ranges: DateRange[] = [];
  for (const r of paid) {
    ranges.push({ start: toDateOnlyString(r.checkIn), end: toDateOnlyString(r.checkOut) });
  }
  for (const b of blocks) {
    ranges.push({ start: toDateOnlyString(b.startDate), end: toDateOnlyString(b.endDate) });
  }
  return ranges;
}

export async function hasBlockingOverlap(
  checkIn: string,
  checkOut: string,
  excludeReservationId?: string,
): Promise<boolean> {
  const ranges = await getBlockingRanges(checkIn, checkOut, excludeReservationId);
  return ranges.some((r) => checkDateOverlap(checkIn, checkOut, r.start, r.end));
}

export async function checkAvailabilityForStay(
  checkIn: string,
  checkOut: string,
): Promise<{ isAvailable: boolean; reason?: string }> {
  const nights = getNights(checkIn, checkOut);
  if (nights <= 0) {
    return { isAvailable: false, reason: "Check-out must be after check-in." };
  }
  const overlap = await hasBlockingOverlap(checkIn, checkOut);
  if (overlap) {
    return {
      isAvailable: false,
      reason: "Those dates conflict with a confirmed stay or host block. Please choose different dates.",
    };
  }
  return { isAvailable: true };
}

export async function createReservationRequest(input: CreateReservationInput) {
  const pricing = calculateReservationTotal(input.guestCount, input.checkIn, input.checkOut);
  if (!pricing) {
    throw new Error("Invalid date range.");
  }

  return prisma.reservation.create({
    data: {
      guestName: input.guestName.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      guestCount: input.guestCount,
      checkIn: parseDateOnly(input.checkIn),
      checkOut: parseDateOnly(input.checkOut),
      nights: pricing.nights,
      baseRate: toDecimal(pricing.baseRate),
      extraGuestFee: toDecimal(pricing.extraGuestFee),
      totalAmount: toDecimal(pricing.totalAmount),
      status: DbReservationStatus.PENDING_REVIEW,
      notes: input.notes?.trim() || null,
    },
  });
}

export async function getReservations(status?: DbReservationStatus) {
  return prisma.reservation.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getReservationById(id: string) {
  return prisma.reservation.findUnique({ where: { id } });
}

export async function setReservationCheckoutSession(id: string, sessionId: string) {
  return prisma.reservation.update({
    where: { id },
    data: { stripeCheckoutSessionId: sessionId },
  });
}

const ALLOWED_TRANSITIONS: Record<DbReservationStatus, DbReservationStatus[]> = {
  [DbReservationStatus.PENDING_REVIEW]: [
    DbReservationStatus.APPROVED_AWAITING_PAYMENT,
    DbReservationStatus.REJECTED,
    DbReservationStatus.CANCELLED,
  ],
  [DbReservationStatus.APPROVED_AWAITING_PAYMENT]: [
    DbReservationStatus.PAID_CONFIRMED,
    DbReservationStatus.REJECTED,
    DbReservationStatus.CANCELLED,
  ],
  [DbReservationStatus.PAID_CONFIRMED]: [DbReservationStatus.CANCELLED],
  [DbReservationStatus.REJECTED]: [],
  [DbReservationStatus.CANCELLED]: [],
};

export async function updateReservationStatus(
  id: string,
  status: DbReservationStatus,
  opts?: {
    stripeCheckoutSessionId?: string | null;
    stripePaymentIntentId?: string | null;
  },
) {
  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Reservation not found.");
  }

  const allowed = ALLOWED_TRANSITIONS[existing.status] ?? [];
  if (!allowed.includes(status)) {
    throw new Error(`Cannot transition from ${existing.status} to ${status}.`);
  }

  if (status === DbReservationStatus.PAID_CONFIRMED) {
    const checkIn = toDateOnlyString(existing.checkIn);
    const checkOut = toDateOnlyString(existing.checkOut);
    const conflict = await hasBlockingOverlap(checkIn, checkOut, id);
    if (conflict) {
      throw new Error(
        "Cannot confirm: dates overlap another paid reservation or calendar block.",
      );
    }
  }

  return prisma.reservation.update({
    where: { id },
    data: {
      status,
      ...(opts?.stripeCheckoutSessionId !== undefined
        ? { stripeCheckoutSessionId: opts.stripeCheckoutSessionId }
        : {}),
      ...(opts?.stripePaymentIntentId !== undefined
        ? { stripePaymentIntentId: opts.stripePaymentIntentId }
        : {}),
    },
  });
}

export async function getAvailabilityForMonth(
  year: number,
  month: number,
): Promise<MonthAvailability> {
  const { from, to, fromStr, toStr } = monthBounds(year, month);
  const rangeEndExclusive = new Date(to.getTime() + 86400000);

  const [paid, blocks] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        status: DbReservationStatus.PAID_CONFIRMED,
        checkIn: { lt: rangeEndExclusive },
        checkOut: { gt: from },
      },
      select: { id: true, checkIn: true, checkOut: true },
      orderBy: { checkIn: "asc" },
    }),
    prisma.calendarBlock.findMany({
      where: {
        startDate: { lt: rangeEndExclusive },
        endDate: { gt: from },
      },
      orderBy: { startDate: "asc" },
    }),
  ]);

  const paidReservations: DateRange[] = paid.map((r) => ({
    start: toDateOnlyString(r.checkIn),
    end: toDateOnlyString(r.checkOut),
  }));

  const calendarBlocks = blocks.map((b) => ({
    id: b.id,
    start: toDateOnlyString(b.startDate),
    end: toDateOnlyString(b.endDate),
    reason: b.reason,
  }));

  const blockedRanges: DateRange[] = [...paidReservations];
  for (const b of calendarBlocks) {
    blockedRanges.push({ start: b.start, end: b.end });
  }

  return {
    year,
    month,
    from: fromStr,
    to: toStr,
    paidReservations,
    calendarBlocks,
    blockedRanges,
  };
}

export interface PublicCalendarPayload {
  bookedRanges: DateRange[];
  pendingRanges: DateRange[];
  blocks: Array<{
    id: string;
    startDateUtc: string;
    endDateUtc: string;
    reason: string;
  }>;
}

/** Public availability calendar — paid stays, pending requests, and manual blocks from Postgres. */
export async function getCalendarApiPayload(from: string, to: string): Promise<PublicCalendarPayload> {
  const start = parseDateOnly(from);
  const end = parseDateOnly(to);

  const [paid, pending, blocks] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        status: DbReservationStatus.PAID_CONFIRMED,
        checkIn: { lt: end },
        checkOut: { gt: start },
      },
      select: { checkIn: true, checkOut: true },
    }),
    prisma.reservation.findMany({
      where: {
        status: {
          in: [
            DbReservationStatus.PENDING_REVIEW,
            DbReservationStatus.APPROVED_AWAITING_PAYMENT,
          ],
        },
        checkIn: { lt: end },
        checkOut: { gt: start },
      },
      select: { checkIn: true, checkOut: true },
    }),
    prisma.calendarBlock.findMany({
      where: {
        startDate: { lt: end },
        endDate: { gt: start },
      },
      select: { id: true, startDate: true, endDate: true, reason: true },
    }),
  ]);

  const toRange = (checkIn: Date, checkOut: Date): DateRange => ({
    start: toDateOnlyString(checkIn),
    end: toDateOnlyString(checkOut),
  });

  return {
    bookedRanges: paid.map((r) => toRange(r.checkIn, r.checkOut)),
    pendingRanges: pending.map((r) => toRange(r.checkIn, r.checkOut)),
    blocks: blocks.map((b) => ({
      id: b.id,
      startDateUtc: `${toDateOnlyString(b.startDate)}T00:00:00.000Z`,
      endDateUtc: `${toDateOnlyString(b.endDate)}T00:00:00.000Z`,
      reason: b.reason,
    })),
  };
}

export function serializeReservation(r: Awaited<ReturnType<typeof getReservationById>>) {
  if (!r) return null;
  return {
    id: r.id,
    guestName: r.guestName,
    email: r.email,
    phone: r.phone,
    guestCount: r.guestCount,
    checkIn: toDateOnlyString(r.checkIn),
    checkOut: toDateOnlyString(r.checkOut),
    nights: r.nights,
    baseRate: decimalToNumber(r.baseRate),
    extraGuestFee: decimalToNumber(r.extraGuestFee),
    totalAmount: decimalToNumber(r.totalAmount),
    status: r.status,
    notes: r.notes,
    stripeCheckoutSessionId: r.stripeCheckoutSessionId,
    stripePaymentIntentId: r.stripePaymentIntentId,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}
