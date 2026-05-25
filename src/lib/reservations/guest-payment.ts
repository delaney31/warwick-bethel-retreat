import { ReservationDbStatus, getReservationById, serializeReservation } from "./index";

export interface GuestReservationPaymentView {
  id: string;
  guestName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  totalAmount: number;
  status: ReservationDbStatus;
  notes: string | null;
  stripeCheckoutSessionId: string | null;
  canPay: boolean;
  isPaid: boolean;
  isPendingReview: boolean;
  isCancelled: boolean;
  isRejected: boolean;
}

export async function getGuestReservationPaymentView(
  id: string,
): Promise<GuestReservationPaymentView | null> {
  const row = await getReservationById(id);
  if (!row) return null;
  const r = serializeReservation(row);
  if (!r) return null;

  return {
    id: r.id,
    guestName: r.guestName,
    email: r.email,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    nights: r.nights,
    guestCount: r.guestCount,
    totalAmount: r.totalAmount,
    status: r.status,
    notes: r.notes,
    stripeCheckoutSessionId: r.stripeCheckoutSessionId,
    canPay: r.status === ReservationDbStatus.APPROVED_AWAITING_PAYMENT,
    isPaid: r.status === ReservationDbStatus.PAID_CONFIRMED,
    isPendingReview: r.status === ReservationDbStatus.PENDING_REVIEW,
    isCancelled: r.status === ReservationDbStatus.CANCELLED,
    isRejected: r.status === ReservationDbStatus.REJECTED,
  };
}
