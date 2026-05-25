import { Prisma } from "@prisma/client";

/** Total stay amount in cents from the database (source of truth for Stripe). */
export function reservationTotalCents(row: {
  totalAmount: Prisma.Decimal | number;
}): number {
  const total =
    row.totalAmount instanceof Prisma.Decimal
      ? row.totalAmount.toNumber()
      : Number(row.totalAmount);
  return Math.round(total * 100);
}

export function centsToDollars(cents: number): number {
  return cents / 100;
}
