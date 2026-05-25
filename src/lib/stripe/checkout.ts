import Stripe from "stripe";
import {
  ReservationDbStatus,
  getReservationById,
  serializeReservation,
  setReservationCheckoutSession,
  updateReservationStatus,
} from "@/lib/reservations";
import { getAppOrigin, getStripe } from "./client";
import { reservationTotalCents } from "./amounts";

function paymentUrls(reservationId: string) {
  const origin = getAppOrigin();
  const base = `${origin}/reservations/${reservationId}/payment`;
  return {
    success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/cancel`,
  };
}

function buildLineItems(
  reservation: NonNullable<ReturnType<typeof serializeReservation>>,
  amountCents: number,
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return [
    {
      price_data: {
        currency: "usd",
        unit_amount: amountCents,
        product_data: {
          name: "Warwick Bethel Retreat",
          description: `${reservation.roomPackageLabel} · ${reservation.nights} night${reservation.nights !== 1 ? "s" : ""} · ${reservation.checkIn} → ${reservation.checkOut} · ${reservation.guestCount} guest${reservation.guestCount !== 1 ? "s" : ""}`,
        },
      },
      quantity: 1,
    },
  ];
}

async function tryReuseOpenSession(
  sessionId: string,
  expectedCents: number,
  reservationId: string,
): Promise<{ checkoutUrl: string; sessionId: string } | null> {
  const stripe = getStripe();
  const existing = await stripe.checkout.sessions.retrieve(sessionId);

  if (existing.status === "open" && existing.url) {
    if (existing.amount_total === expectedCents && existing.metadata?.reservationId === reservationId) {
      return { checkoutUrl: existing.url, sessionId: existing.id };
    }
    await stripe.checkout.sessions.expire(sessionId);
    return null;
  }

  if (existing.status === "complete" && existing.payment_status === "paid") {
    return null;
  }

  return null;
}

/**
 * Creates or reuses a Stripe Checkout Session. Amount always comes from Postgres.
 * Caller must ensure reservation is APPROVED_AWAITING_PAYMENT.
 */
export async function createReservationCheckoutSession(reservationId: string) {
  const row = await getReservationById(reservationId);
  if (!row) throw new Error("Reservation not found.");

  if (row.status === ReservationDbStatus.PAID_CONFIRMED) {
    throw new Error("This reservation is already paid and confirmed.");
  }

  if (row.status !== ReservationDbStatus.APPROVED_AWAITING_PAYMENT) {
    throw new Error("Reservation must be approved before payment.");
  }

  const reservation = serializeReservation(row);
  if (!reservation) throw new Error("Reservation not found.");

  const amountCents = reservationTotalCents(row);
  if (amountCents < 50) throw new Error("Total amount is too small for checkout.");

  const stripe = getStripe();

  if (row.stripeCheckoutSessionId) {
    const reused = await tryReuseOpenSession(
      row.stripeCheckoutSessionId,
      amountCents,
      reservationId,
    );
    if (reused) {
      return {
        ...reused,
        reservation,
      };
    }
  }

  const urls = paymentUrls(reservationId);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: reservation.email,
    line_items: buildLineItems(reservation, amountCents),
    metadata: { reservationId: reservation.id },
    client_reference_id: reservation.id,
    success_url: urls.success_url,
    cancel_url: urls.cancel_url,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");

  await setReservationCheckoutSession(reservationId, session.id);

  const updated = await getReservationById(reservationId);
  return {
    checkoutUrl: session.url,
    sessionId: session.id,
    reservation: serializeReservation(updated),
  };
}

/** Host approves a request, then creates checkout in one step. */
export async function approveReservationAndCreateCheckout(reservationId: string) {
  const row = await getReservationById(reservationId);
  if (!row) throw new Error("Reservation not found.");

  if (row.status === ReservationDbStatus.PAID_CONFIRMED) {
    throw new Error("Reservation is already confirmed.");
  }

  if (row.status === ReservationDbStatus.PENDING_REVIEW) {
    await updateReservationStatus(reservationId, ReservationDbStatus.APPROVED_AWAITING_PAYMENT);
  } else if (row.status !== ReservationDbStatus.APPROVED_AWAITING_PAYMENT) {
    throw new Error(`Cannot approve reservation in status ${row.status}.`);
  }

  return createReservationCheckoutSession(reservationId);
}

export async function retrieveCheckoutUrl(sessionId: string): Promise<string | null> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session.url ?? null;
}

export async function retrieveCheckoutSessionForGuest(sessionId: string, reservationId: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.metadata?.reservationId !== reservationId) {
    throw new Error("Session does not match this reservation.");
  }
  return session;
}
