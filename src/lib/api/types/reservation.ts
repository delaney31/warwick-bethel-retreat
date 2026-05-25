/**
 * Reservation types matching backend DTOs.
 */

export type PickupPreference = "SantaMonica" | "Delivery";

export type ReservationStatus =
  | "PendingReview"
  | "Approved"
  | "DocumentsSubmitted"
  | "DocumentsApproved"
  | "AgreementSent"
  | "AgreementSigned"
  | "AwaitingPayment"
  | "Confirmed"
  | "Active"
  | "Returned"
  | "Completed"
  | "Rejected"
  | "Cancelled";

export interface CreateReservationRequest {
  vehicleId: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  startDate: string;
  endDate: string;
  pickupPreference: PickupPreference;
  driverAge: number;
  notes?: string | null;
}

export interface ReservationCreated {
  id: string;
  status: string;
}

export interface ReservationSummary {
  id: string;
  vehicleId: string;
  vehicleDisplayName: string;
  status: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  startDate: string;
  endDate: string;
  pickupPreference: string;
  driverAge: number;
  notes: string;
  rentalDays: number;
  dailyRateAtBooking: number;
  subtotal: number;
  createdAtUtc: string;
}

export interface ReservationDetail {
  id: string;
  vehicleId: string;
  vehicleDisplayName: string;
  status: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  startDate: string;
  endDate: string;
  pickupPreference: string;
  driverAge: number;
  notes: string;
  createdAtUtc: string;
}

export interface UpdateReservationStatusRequest {
  status: ReservationStatus;
  message?: string | null;
}
