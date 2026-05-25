export enum ReservationStatus {
  PendingReview = "pending_review",
  Approved = "approved",
  DocumentsSubmitted = "documents_submitted",
  DocumentsApproved = "documents_approved",
  AgreementSent = "agreement_sent",
  AgreementSigned = "agreement_signed",
  AwaitingPayment = "awaiting_payment",
  Confirmed = "confirmed",
  Active = "active",
  Returned = "returned",
  Completed = "completed",
  Rejected = "rejected",
  Cancelled = "cancelled",
}

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  [ReservationStatus.PendingReview]: "Pending Review",
  [ReservationStatus.Approved]: "Approved",
  [ReservationStatus.DocumentsSubmitted]: "Documents Submitted",
  [ReservationStatus.DocumentsApproved]: "Documents Approved",
  [ReservationStatus.AgreementSent]: "Awaiting Signature",
  [ReservationStatus.AgreementSigned]: "Agreement Signed",
  [ReservationStatus.AwaitingPayment]: "Awaiting Payment",
  [ReservationStatus.Confirmed]: "Confirmed",
  [ReservationStatus.Active]: "Active Stay",
  [ReservationStatus.Returned]: "Checked Out",
  [ReservationStatus.Completed]: "Completed",
  [ReservationStatus.Rejected]: "Rejected",
  [ReservationStatus.Cancelled]: "Cancelled",
};

export type PickupPreference = "santa_monica" | "delivery";

export interface BookingRequestFormData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guestCount: string;
  guestNotes: string;
}

export interface Reservation {
  id: string;
  vehicleId: string;
  vehicleDisplayName: string;
  status: ReservationStatus;
  renterName: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  pickupPreference: PickupPreference;
  driverAge: number;
  notes: string;
  rentalDays: number;
  dailyRateAtBooking: number;
  subtotal: number;
  createdAt: string;
}
