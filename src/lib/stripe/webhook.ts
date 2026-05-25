import type Stripe from "stripe";
import {
  ReservationDbStatus,
  getReservationById,
  updateReservationStatus,
} from "@/lib/reservations";
import { getStripe, getWebhookSecret } from "./client";
import { reservationTotalCents } from "./amounts";

function paymentIntentId(
  paymentIntent: string | Stripe.PaymentIntent | null | undefined,
): string | null {
  if (!paymentIntent) return null;
  if (typeof paymentIntent === "string") return paymentIntent;
  return paymentIntent.id ?? null;
}

export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const reservationId =
    session.metadata?.reservationId ?? session.client_reference_id ?? null;
  if (!reservationId) {
    throw new Error("Checkout session missing reservationId metadata.");
  }

  const row = await getReservationById(reservationId);
  if (!row) {
    throw new Error(`Reservation ${reservationId} not found.`);
  }

  if (row.status === ReservationDbStatus.PAID_CONFIRMED) {
    return { alreadyConfirmed: true, reservationId };
  }

  const expectedCents = reservationTotalCents(row);
  const paidCents = session.amount_total ?? 0;
  if (paidCents !== expectedCents) {
    throw new Error(
      `Payment amount mismatch for ${reservationId}: expected ${expectedCents} cents, got ${paidCents}.`,
    );
  }

  if (session.payment_status !== "paid") {
    throw new Error(`Checkout session ${session.id} is not paid.`);
  }

  const piId = paymentIntentId(session.payment_intent);

  await updateReservationStatus(reservationId, ReservationDbStatus.PAID_CONFIRMED, {
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: piId,
  });

  return { alreadyConfirmed: false, reservationId };
}

export function constructStripeEvent(payload: string, signature: string): Stripe.Event {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(payload, signature, getWebhookSecret());
}
