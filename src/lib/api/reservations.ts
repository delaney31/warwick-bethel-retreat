import { api } from "./client";
import { mapBackendReservationStatus } from "./agreements";
import type {
  Reservation,
  PickupPreference,
  ReservationStatus as FrontendReservationStatus,
} from "@/types/reservation";
import type {
  CreateReservationRequest,
  ReservationCreated,
  ReservationSummary,
  ReservationDetail,
  ReservationStatus as ApiReservationStatus,
  UpdateReservationStatusRequest,
} from "./types/reservation";

/**
 * Create a reservation (public). Validates availability.
 */
export async function createReservation(
  request: CreateReservationRequest,
): Promise<ReservationCreated> {
  return api.post<ReservationCreated>("/reservations", request);
}

/**
 * List reservations (admin). Optional status filter.
 */
export async function getReservations(
  status?: string,
  opts?: { signal?: AbortSignal },
): Promise<ReservationSummary[]> {
  const path = status ? `/admin/reservations?status=${encodeURIComponent(status)}` : "/admin/reservations";
  return api.get<ReservationSummary[]>(path, opts);
}

function mapApiPickupToFrontend(pref: string): PickupPreference {
  const p = pref?.trim();
  if (p === "Delivery") return "delivery";
  return "santa_monica";
}

/** Inclusive rental days from ISO dates (fallback if API omits counts). */
function rentalDaysInclusive(start: string, end: string): number {
  const a = start.slice(0, 10).split("-").map(Number);
  const b = end.slice(0, 10).split("-").map(Number);
  const t0 = Date.UTC(a[0], a[1] - 1, a[2]);
  const t1 = Date.UTC(b[0], b[1] - 1, b[2]);
  return Math.floor((t1 - t0) / 86400000) + 1;
}

/**
 * Maps admin list DTO to client `Reservation`.
 */
export function mapReservationSummaryToReservation(s: ReservationSummary): Reservation {
  const startDate = s.startDate.slice(0, 10);
  const endDate = s.endDate.slice(0, 10);
  const rentalDays =
    typeof s.rentalDays === "number" && s.rentalDays > 0
      ? s.rentalDays
      : Math.max(1, rentalDaysInclusive(startDate, endDate));
  return {
    id: s.id,
    vehicleId: s.vehicleId ?? "",
    vehicleDisplayName: s.vehicleDisplayName,
    status: mapBackendReservationStatus(s.status),
    renterName: s.renterName,
    email: s.renterEmail,
    phone: s.renterPhone ?? "",
    startDate,
    endDate,
    pickupPreference: mapApiPickupToFrontend(s.pickupPreference),
    driverAge: typeof s.driverAge === "number" ? s.driverAge : 0,
    notes: s.notes ?? "",
    rentalDays,
    dailyRateAtBooking: typeof s.dailyRateAtBooking === "number" ? s.dailyRateAtBooking : 0,
    subtotal: typeof s.subtotal === "number" ? s.subtotal : 0,
    createdAt: s.createdAtUtc,
  };
}

/**
 * Get a reservation by ID (admin).
 */
export async function getReservationById(id: string): Promise<ReservationDetail | null> {
  try {
    return await api.get<ReservationDetail>(`/admin/reservations/${id}`);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err && err.status === 404) {
      return null;
    }
    throw err;
  }
}

/**
 * Update reservation status (admin).
 */
export async function updateReservationStatus(
  id: string,
  request: UpdateReservationStatusRequest,
): Promise<void> {
  return api.patch<void>(`/admin/reservations/${id}/status`, request);
}

/** Maps UI/store enum (snake_case values) to API JSON enum names (PascalCase). */
export function mapFrontendReservationStatusToApi(
  status: FrontendReservationStatus,
): ApiReservationStatus {
  const map: Record<FrontendReservationStatus, ApiReservationStatus> = {
    pending_review: "PendingReview",
    approved: "Approved",
    documents_submitted: "DocumentsSubmitted",
    documents_approved: "DocumentsApproved",
    agreement_sent: "AgreementSent",
    agreement_signed: "AgreementSigned",
    awaiting_payment: "AwaitingPayment",
    confirmed: "Confirmed",
    active: "Active",
    returned: "Returned",
    completed: "Completed",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };
  return map[status];
}
