import "server-only";

import { Prisma, ReservationStatus as DbReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { isDatabaseConfigured, isProductionRuntime, requireDatabase } from "./db";
import {
  calculateReservationTotal,
  checkDateOverlap,
  DEFAULT_BASE_RATE,
  DEFAULT_EXTRA_GUEST_NIGHTLY,
  getNights,
  GUESTS_INCLUDED,
  type ReservationPricing,
} from "./helpers";

export { ReservationDbStatus } from "./status";
export {
  calculateReservationTotal,
  checkDateOverlap,
  DEFAULT_BASE_RATE,
  DEFAULT_EXTRA_GUEST_NIGHTLY,
  getNights,
  GUESTS_INCLUDED,
  type ReservationPricing,
};

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
  /** Dates that block new PAID_CONFIRMED bookings (paid stays + manual blocks only). */
  blockedRanges: DateRange[];
}

export interface SerializedCalendarBlock {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
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

function serializeCalendarBlock(row: {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}): SerializedCalendarBlock {
  return {
    id: row.id,
    startDate: toDateOnlyString(row.startDate),
    endDate: toDateOnlyString(row.endDate),
    reason: row.reason,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** Ranges that block bookings: PAID_CONFIRMED only + manual CalendarBlock (not pending/unpaid). */
async function getBlockingRanges(
  rangeStart: string,
  rangeEnd: string,
  excludeReservationId?: string,
): Promise<DateRange[]> {
  requireDatabase();

  const start = parseDateOnly(rangeStart);
  const end = parseDateOnly(rangeEnd);

  try {
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
  } catch (err) {
    console.error("[reservations] blocking range query failed", err);
    throw err;
  }
}

export async function hasBlockingOverlap(
  checkIn: string,
  checkOut: string,
  excludeReservationId?: string,
): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;
  try {
    const ranges = await getBlockingRanges(checkIn, checkOut, excludeReservationId);
    return ranges.some((r) => checkDateOverlap(checkIn, checkOut, r.start, r.end));
  } catch (err) {
    console.error("[reservations] blocking overlap check failed", err);
    return false;
  }
}

export async function checkAvailabilityForStay(
  checkIn: string,
  checkOut: string,
): Promise<{ isAvailable: boolean; reason?: string }> {
  const nights = getNights(checkIn, checkOut);
  if (nights <= 0) {
    return { isAvailable: false, reason: "Check-out must be after check-in." };
  }
  if (!isDatabaseConfigured()) {
    return { isAvailable: true };
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

/** Guest request — always PENDING_REVIEW; may overlap other pending/approved-unpaid stays. */
export async function createReservationRequest(input: CreateReservationInput) {
  const pricing = calculateReservationTotal(input.guestCount, input.checkIn, input.checkOut);
  if (!pricing) {
    throw new Error("Invalid date range.");
  }

  if (isDatabaseConfigured()) {
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

  if (isProductionRuntime()) {
    requireDatabase();
  }

  console.warn("[reservations] DATABASE_URL not set — dev fallback JSON store");
  const { fallbackCreateReservation } = await import("./fallback-store");
  return fallbackCreateReservation(input, pricing);
}

export async function getReservations(status?: DbReservationStatus) {
  requireDatabase();
  return prisma.reservation.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getReservationById(id: string) {
  requireDatabase();
  return prisma.reservation.findUnique({ where: { id } });
}

export async function setReservationCheckoutSession(id: string, sessionId: string) {
  requireDatabase();
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

/**
 * Status workflow with overlap guard when marking PAID_CONFIRMED.
 * APPROVED_AWAITING_PAYMENT does not block the calendar until paid.
 */
export async function updateReservationStatus(
  id: string,
  status: DbReservationStatus,
  opts?: {
    stripeCheckoutSessionId?: string | null;
    stripePaymentIntentId?: string | null;
  },
) {
  requireDatabase();

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
  requireDatabase();

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

export async function listCalendarBlocks(): Promise<SerializedCalendarBlock[]> {
  requireDatabase();
  const rows = await prisma.calendarBlock.findMany({ orderBy: { startDate: "asc" } });
  return rows.map(serializeCalendarBlock);
}

export async function getCalendarBlocksInRange(
  from: string,
  to: string,
): Promise<SerializedCalendarBlock[]> {
  requireDatabase();
  const start = parseDateOnly(from);
  const end = parseDateOnly(to);
  const rows = await prisma.calendarBlock.findMany({
    where: {
      startDate: { lt: end },
      endDate: { gt: start },
    },
    orderBy: { startDate: "asc" },
  });
  return rows.map(serializeCalendarBlock);
}

export async function createCalendarBlock(input: {
  startDate: string;
  endDate: string;
  reason: string;
}): Promise<SerializedCalendarBlock> {
  requireDatabase();

  const start = parseDateOnly(input.startDate);
  const end = parseDateOnly(input.endDate);
  if (end.getTime() <= start.getTime()) {
    throw new Error("endDate must be after startDate.");
  }

  const overlap = await prisma.calendarBlock.findFirst({
    where: {
      startDate: { lt: end },
      endDate: { gt: start },
    },
  });
  if (overlap) {
    throw new Error("Calendar block overlaps an existing block.");
  }

  const row = await prisma.calendarBlock.create({
    data: {
      startDate: start,
      endDate: end,
      reason: input.reason.trim(),
    },
  });
  return serializeCalendarBlock(row);
}

export async function deleteCalendarBlock(id: string): Promise<void> {
  requireDatabase();
  try {
    await prisma.calendarBlock.delete({ where: { id } });
  } catch {
    throw new Error("Calendar block not found.");
  }
}

export interface PublicCalendarBlock {
  id: string;
  startDateUtc: string;
  endDateUtc: string;
  reason: string;
}

export interface PublicCalendarPayload {
  configured: boolean;
  bookedRanges: DateRange[];
  pendingReviewRanges: DateRange[];
  approvedAwaitingRanges: DateRange[];
  blocks: PublicCalendarBlock[];
}

/** Public calendar from PostgreSQL — paid stays block; pending/approved are visible but non-blocking. */
export async function getCalendarApiPayload(from: string, to: string): Promise<PublicCalendarPayload> {
  if (!isDatabaseConfigured()) {
    return {
      configured: false,
      bookedRanges: [],
      pendingReviewRanges: [],
      approvedAwaitingRanges: [],
      blocks: [],
    };
  }

  requireDatabase();

  const start = parseDateOnly(from);
  const end = parseDateOnly(to);

  const rangeFilter = {
    checkIn: { lt: end },
    checkOut: { gt: start },
  };

  const [paid, pendingReview, approvedAwaiting, blocks] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        status: DbReservationStatus.PAID_CONFIRMED,
        ...rangeFilter,
      },
      select: { checkIn: true, checkOut: true },
    }),
    prisma.reservation.findMany({
      where: {
        status: DbReservationStatus.PENDING_REVIEW,
        ...rangeFilter,
      },
      select: { checkIn: true, checkOut: true },
    }),
    prisma.reservation.findMany({
      where: {
        status: DbReservationStatus.APPROVED_AWAITING_PAYMENT,
        ...rangeFilter,
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
    configured: true,
    bookedRanges: paid.map((r) => toRange(r.checkIn, r.checkOut)),
    pendingReviewRanges: pendingReview.map((r) => toRange(r.checkIn, r.checkOut)),
    approvedAwaitingRanges: approvedAwaiting.map((r) => toRange(r.checkIn, r.checkOut)),
    blocks: blocks.map((b) => ({
      id: b.id,
      startDateUtc: `${toDateOnlyString(b.startDate)}T00:00:00.000Z`,
      endDateUtc: `${toDateOnlyString(b.endDate)}T00:00:00.000Z`,
      reason: b.reason,
    })),
  };
}

type PersistedReservationRow = {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  guestCount: number;
  checkIn: Date | string;
  checkOut: Date | string;
  nights: number;
  baseRate: Prisma.Decimal | number;
  extraGuestFee: Prisma.Decimal | number;
  totalAmount: Prisma.Decimal | number;
  status: DbReservationStatus;
  notes: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
};

export function serializeReservation(r: PersistedReservationRow | null) {
  if (!r) return null;

  const checkIn =
    r.checkIn instanceof Date ? toDateOnlyString(r.checkIn) : String(r.checkIn).slice(0, 10);
  const checkOut =
    r.checkOut instanceof Date ? toDateOnlyString(r.checkOut) : String(r.checkOut).slice(0, 10);
  const baseRate =
    typeof r.baseRate === "object" && "toNumber" in (r.baseRate as object)
      ? decimalToNumber(r.baseRate as Prisma.Decimal)
      : Number(r.baseRate);
  const extraGuestFee =
    typeof r.extraGuestFee === "object" && "toNumber" in (r.extraGuestFee as object)
      ? decimalToNumber(r.extraGuestFee as Prisma.Decimal)
      : Number(r.extraGuestFee);
  const totalAmount =
    typeof r.totalAmount === "object" && "toNumber" in (r.totalAmount as object)
      ? decimalToNumber(r.totalAmount as Prisma.Decimal)
      : Number(r.totalAmount);
  const createdAt =
    r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt);
  const updatedAt =
    r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt);

  return {
    id: r.id,
    guestName: r.guestName,
    email: r.email,
    phone: r.phone,
    guestCount: r.guestCount,
    checkIn,
    checkOut,
    nights: r.nights,
    baseRate,
    extraGuestFee,
    totalAmount,
    status: r.status,
    notes: r.notes,
    stripeCheckoutSessionId:
      "stripeCheckoutSessionId" in r ? r.stripeCheckoutSessionId : null,
    stripePaymentIntentId:
      "stripePaymentIntentId" in r ? r.stripePaymentIntentId : null,
    createdAt,
    updatedAt,
  };
}
