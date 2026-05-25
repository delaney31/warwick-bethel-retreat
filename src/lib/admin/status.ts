import { ReservationDbStatus } from "@/lib/reservations";

export const HOST_STATUS_LABELS: Record<ReservationDbStatus, string> = {
  [ReservationDbStatus.PENDING_REVIEW]: "Pending Review",
  [ReservationDbStatus.APPROVED_AWAITING_PAYMENT]: "Approved · Awaiting Payment",
  [ReservationDbStatus.PAID_CONFIRMED]: "Paid · Confirmed",
  [ReservationDbStatus.REJECTED]: "Rejected",
  [ReservationDbStatus.CANCELLED]: "Cancelled",
};

export const HOST_STATUS_ORDER: ReservationDbStatus[] = [
  ReservationDbStatus.PENDING_REVIEW,
  ReservationDbStatus.APPROVED_AWAITING_PAYMENT,
  ReservationDbStatus.PAID_CONFIRMED,
  ReservationDbStatus.REJECTED,
  ReservationDbStatus.CANCELLED,
];

export const HOST_STATUS_STYLES: Record<ReservationDbStatus, string> = {
  [ReservationDbStatus.PENDING_REVIEW]:
    "bg-amber-50 text-amber-950 ring-1 ring-amber-200/80",
  [ReservationDbStatus.APPROVED_AWAITING_PAYMENT]:
    "bg-sky-50 text-sky-950 ring-1 ring-sky-200/80",
  [ReservationDbStatus.PAID_CONFIRMED]:
    "bg-sage-100 text-sage-900 ring-1 ring-sage-300/60",
  [ReservationDbStatus.REJECTED]:
    "bg-red-50 text-red-900 ring-1 ring-red-200/70",
  [ReservationDbStatus.CANCELLED]:
    "bg-stone-100 text-stone-600 ring-1 ring-stone-200/80",
};
