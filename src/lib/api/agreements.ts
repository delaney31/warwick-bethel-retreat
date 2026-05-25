import { api } from "./client";
import { getApiBaseUrl } from "./config";
import { ApiError } from "./errors";
import { ReservationStatus } from "@/types/reservation";
import { AgreementStatus } from "@/types/agreement";

/** Matches backend AgreementStateDto (camelCase JSON). */
export interface AgreementStateDto {
  reservationId: string;
  reservationStatus: string;
  agreementStatus: string;
  sentAtUtc: string | null;
  signedAtUtc: string | null;
  templateKey: string | null;
  externalProviderId: string | null;
  providerPlaceholder: string;
}

/** Maps backend ReservationStatus.ToString() (PascalCase) to frontend enum. */
export function mapBackendReservationStatus(s: string): ReservationStatus {
  const map: Record<string, ReservationStatus> = {
    PendingReview: ReservationStatus.PendingReview,
    Approved: ReservationStatus.Approved,
    DocumentsSubmitted: ReservationStatus.DocumentsSubmitted,
    DocumentsApproved: ReservationStatus.DocumentsApproved,
    AgreementSent: ReservationStatus.AgreementSent,
    AgreementSigned: ReservationStatus.AgreementSigned,
    AwaitingPayment: ReservationStatus.AwaitingPayment,
    Confirmed: ReservationStatus.Confirmed,
    Active: ReservationStatus.Active,
    Returned: ReservationStatus.Returned,
    Completed: ReservationStatus.Completed,
    Rejected: ReservationStatus.Rejected,
    Cancelled: ReservationStatus.Cancelled,
  };
  return map[s] ?? ReservationStatus.PendingReview;
}

/** Backend AgreementStatus: NotSent, Sent, Signed */
export function mapBackendAgreementStatus(s: string): AgreementStatus {
  switch (s) {
    case "NotSent":
      return AgreementStatus.NotSent;
    case "Sent":
      return AgreementStatus.Sent;
    case "Signed":
      return AgreementStatus.Signed;
    default:
      return AgreementStatus.NotSent;
  }
}

/** Public: GET agreement state (no auth). */
export async function getAgreementState(
  reservationId: string,
  signal?: AbortSignal,
): Promise<AgreementStateDto> {
  return api.get<AgreementStateDto>(`/reservations/${reservationId}/agreement`, {
    signal,
  });
}

/** Public: renter completes placeholder sign (same rules as admin mark-signed). */
export async function postPublicAgreementMarkSigned(
  reservationId: string,
  signal?: AbortSignal,
): Promise<AgreementStateDto> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const res = await fetch(
    `${base}/reservations/${reservationId}/agreement/mark-signed`,
    {
      method: "POST",
      signal,
    },
  );
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, res.statusText, body);
  }
  return body as AgreementStateDto;
}

/** Admin: send agreement to renter. */
export async function postAdminAgreementSend(
  reservationId: string,
  signal?: AbortSignal,
): Promise<AgreementStateDto> {
  return api.post<AgreementStateDto>(
    `/admin/reservations/${reservationId}/agreement/send`,
    undefined,
    { signal },
  );
}

/** Admin: mark agreement signed (AgreementSent → AwaitingPayment). */
export async function postAdminAgreementMarkSigned(
  reservationId: string,
  signal?: AbortSignal,
): Promise<AgreementStateDto> {
  return api.post<AgreementStateDto>(
    `/admin/reservations/${reservationId}/agreement/mark-signed`,
    undefined,
    { signal },
  );
}
