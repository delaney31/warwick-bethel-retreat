import { ReservationDbStatus, getReservationById } from "@/lib/reservations";
import { getAppOrigin } from "./client";
import { createReservationCheckoutSession, retrieveCheckoutUrl } from "./checkout";

export function getGuestPaymentPageUrl(reservationId: string): string {
  return `${getAppOrigin()}/reservations/${reservationId}/payment`;
}

export interface ResolvedPaymentLinks {
  guestPaymentUrl: string;
  /** Direct Stripe Checkout URL when session is open; null if not yet approved or Stripe unavailable. */
  stripeCheckoutUrl: string | null;
}

/**
 * Guest-facing payment hub plus Stripe Checkout when the stay is approved.
 * Amount always comes from the database when creating a session.
 */
export async function resolveGuestPaymentLinks(
  reservationId: string,
): Promise<ResolvedPaymentLinks> {
  const guestPaymentUrl = getGuestPaymentPageUrl(reservationId);
  const row = await getReservationById(reservationId);
  if (!row) {
    throw new Error("Reservation not found.");
  }

  if (row.status === ReservationDbStatus.PAID_CONFIRMED) {
    return { guestPaymentUrl, stripeCheckoutUrl: null };
  }

  if (row.status !== ReservationDbStatus.APPROVED_AWAITING_PAYMENT) {
    return { guestPaymentUrl, stripeCheckoutUrl: null };
  }

  if (row.stripeCheckoutSessionId) {
    const existing = await retrieveCheckoutUrl(row.stripeCheckoutSessionId);
    if (existing) {
      return { guestPaymentUrl, stripeCheckoutUrl: existing };
    }
  }

  try {
    const session = await createReservationCheckoutSession(reservationId);
    return { guestPaymentUrl, stripeCheckoutUrl: session.checkoutUrl };
  } catch {
    return { guestPaymentUrl, stripeCheckoutUrl: null };
  }
}
