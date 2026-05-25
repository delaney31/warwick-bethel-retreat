import { api } from "./client";

/** Backend PickupChecklistDto (camelCase JSON). */
export interface PickupChecklistDto {
  id: string;
  odometerOut: number;
  fuelOrChargeOutPercent: number;
  conditionNotes: string | null;
  completedAtUtc: string;
  completedBy: string;
}

/** Backend ReturnChecklistDto. */
export interface ReturnChecklistDto {
  id: string;
  odometerIn: number;
  fuelOrChargeInPercent: number;
  conditionNotes: string | null;
  completedAtUtc: string;
  completedBy: string;
}

/** Backend AdditionalChargeDto. */
export interface AdditionalChargeDto {
  id: string;
  reservationId: string;
  type: string;
  amount: number;
  currency: string;
  notes: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
}

/** Backend ReservationOperationsDto. */
export interface ReservationOperationsDto {
  reservationId: string;
  reservationStatus: string;
  pickup: PickupChecklistDto | null;
  return: ReturnChecklistDto | null;
  additionalCharges: AdditionalChargeDto[];
}

export interface RecordPickupRequest {
  odometerOut: number;
  fuelOrChargeOutPercent: number;
  conditionNotes?: string | null;
  completedBy: string;
}

export interface RecordReturnRequest {
  odometerIn: number;
  fuelOrChargeInPercent: number;
  conditionNotes?: string | null;
  completedBy: string;
}

export interface CreateAdditionalChargeRequest {
  type: string;
  amount: number;
  currency?: string | null;
  notes?: string | null;
}

export interface UpdateAdditionalChargeRequest {
  type?: string | null;
  amount?: number | null;
  currency?: string | null;
  notes?: string | null;
}

export async function getAdminReservationOperations(
  reservationId: string,
  signal?: AbortSignal,
): Promise<ReservationOperationsDto> {
  return api.get<ReservationOperationsDto>(
    `/admin/reservations/${reservationId}/operations`,
    { signal },
  );
}

export async function postAdminReservationPickup(
  reservationId: string,
  body: RecordPickupRequest,
  signal?: AbortSignal,
): Promise<PickupChecklistDto> {
  return api.post<PickupChecklistDto>(
    `/admin/reservations/${reservationId}/pickup`,
    {
      odometerOut: body.odometerOut,
      fuelOrChargeOutPercent: body.fuelOrChargeOutPercent,
      conditionNotes: body.conditionNotes ?? null,
      completedBy: body.completedBy,
    },
    { signal },
  );
}

export async function postAdminReservationReturn(
  reservationId: string,
  body: RecordReturnRequest,
  signal?: AbortSignal,
): Promise<ReturnChecklistDto> {
  return api.post<ReturnChecklistDto>(
    `/admin/reservations/${reservationId}/return`,
    {
      odometerIn: body.odometerIn,
      fuelOrChargeInPercent: body.fuelOrChargeInPercent,
      conditionNotes: body.conditionNotes ?? null,
      completedBy: body.completedBy,
    },
    { signal },
  );
}

export async function postAdminReservationComplete(
  reservationId: string,
  signal?: AbortSignal,
): Promise<void> {
  return api.post<void>(
    `/admin/reservations/${reservationId}/complete`,
    undefined,
    { signal },
  );
}

export async function postAdminReservationCharge(
  reservationId: string,
  body: CreateAdditionalChargeRequest,
  signal?: AbortSignal,
): Promise<AdditionalChargeDto> {
  return api.post<AdditionalChargeDto>(
    `/admin/reservations/${reservationId}/charges`,
    {
      type: body.type,
      amount: body.amount,
      currency: body.currency ?? null,
      notes: body.notes ?? null,
    },
    { signal },
  );
}

export async function putAdminCharge(
  chargeId: string,
  body: UpdateAdditionalChargeRequest,
  signal?: AbortSignal,
): Promise<AdditionalChargeDto> {
  return api.put<AdditionalChargeDto>(`/admin/charges/${chargeId}`, {
    type: body.type ?? null,
    amount: body.amount ?? null,
    currency: body.currency ?? null,
    notes: body.notes ?? null,
  }, { signal });
}

export async function deleteAdminCharge(
  chargeId: string,
  signal?: AbortSignal,
): Promise<void> {
  return api.delete<void>(`/admin/charges/${chargeId}`, { signal });
}
