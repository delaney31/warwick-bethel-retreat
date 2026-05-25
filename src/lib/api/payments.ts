import { api } from "./client";
import { getReservations } from "./reservations";

/** Matches backend PaymentDto (camelCase). */
export interface PaymentDto {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: string;
  label: string | null;
  internalNotes: string | null;
  paidAtUtc: string | null;
  failedAtUtc: string | null;
  refundedAtUtc: string | null;
  externalPaymentId: string | null;
  externalCheckoutSessionId: string | null;
  provider: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
}

/** Matches backend PaymentPublicDto. */
export interface PaymentPublicDto {
  reservationId: string;
  reservationStatus: string;
  paymentStatus: string;
  amount: number | null;
  currency: string;
  paidAtUtc: string | null;
  label: string | null;
}

export interface CreatePaymentRequest {
  amount: number;
  currency?: string | null;
  label?: string | null;
  internalNotes?: string | null;
}

export type PatchPaymentStatus =
  | "NotRequested"
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded";

export interface PatchPaymentStatusRequest {
  status: PatchPaymentStatus;
  internalNotes?: string | null;
}

/** Backend PaymentStatus.ToString() values */
export function mapPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    NotRequested: "Not Requested",
    Pending: "Pending",
    Paid: "Paid",
    Failed: "Failed",
    Refunded: "Refunded",
  };
  return labels[status] ?? status;
}

export function paymentStatusBadgeVariant(
  status: string,
): "gray" | "amber" | "green" | "red" | "blue" {
  switch (status) {
    case "Paid":
      return "green";
    case "Pending":
      return "amber";
    case "Failed":
      return "red";
    case "Refunded":
      return "blue";
    case "NotRequested":
    default:
      return "gray";
  }
}

/** Public renter summary */
export async function getPublicReservationPayment(
  reservationId: string,
  signal?: AbortSignal,
): Promise<PaymentPublicDto> {
  return api.get<PaymentPublicDto>(`/reservations/${reservationId}/payment`, {
    signal,
  });
}

export async function listAdminReservationPayments(
  reservationId: string,
  signal?: AbortSignal,
): Promise<PaymentDto[]> {
  return api.get<PaymentDto[]>(
    `/admin/reservations/${reservationId}/payments`,
    { signal },
  );
}

export async function createAdminReservationPayment(
  reservationId: string,
  body: CreatePaymentRequest,
  signal?: AbortSignal,
): Promise<PaymentDto> {
  return api.post<PaymentDto>(
    `/admin/reservations/${reservationId}/payments/create`,
    body,
    { signal },
  );
}

export async function patchAdminPaymentStatus(
  paymentId: string,
  body: PatchPaymentStatusRequest,
  signal?: AbortSignal,
): Promise<PaymentDto> {
  return api.patch<PaymentDto>(
    `/admin/payments/${paymentId}/status`,
    {
      status: body.status,
      internalNotes: body.internalNotes ?? null,
    },
    { signal },
  );
}

export type PaymentWithReservationMeta = PaymentDto & {
  renterName: string;
  vehicleDisplayName: string;
};

/** Flat list for /admin/payments (no global list endpoint). */
export async function fetchAllAdminPaymentsFlat(
  signal?: AbortSignal,
): Promise<PaymentWithReservationMeta[]> {
  const reservations = await getReservations(undefined, { signal });
  const chunks = await Promise.all(
    reservations.map(async (r) => {
      try {
        const list = await listAdminReservationPayments(r.id, signal);
        return list.map((p) => ({
          ...p,
          renterName: r.renterName,
          vehicleDisplayName: r.vehicleDisplayName,
        }));
      } catch {
        return [];
      }
    }),
  );
  return chunks
    .flat()
    .sort(
      (a, b) =>
        new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime(),
    );
}
