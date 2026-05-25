import type { ReservationDbStatus } from "@/lib/reservations/status";

export interface GuestReservationView {
  id: string;
  guestName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  roomPackageLabel: string;
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

export async function fetchGuestReservation(id: string): Promise<GuestReservationView | null> {
  const res = await fetch(`/api/reservations/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as { reservation: GuestReservationView };
  return data.reservation;
}

export async function startGuestCheckout(id: string): Promise<{ checkoutUrl: string } | { error: string }> {
  const res = await fetch(`/api/reservations/${id}/checkout`, { method: "POST" });
  const data = await res.json();
  if (!res.ok) {
    return { error: typeof data.error === "string" ? data.error : "Could not start checkout." };
  }
  return data as { checkoutUrl: string };
}
