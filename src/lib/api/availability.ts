import { api } from "./client";
import type {
  VehicleAvailability,
  AvailabilityCheck,
  AvailabilityBlock,
  CreateAvailabilityBlockRequest,
} from "./types/availability";

/**
 * Fetch availability for a vehicle (blocks + blocked date ranges).
 * Optional from/to to scope the date range.
 */
export async function getVehicleAvailability(
  vehicleId: string,
  from?: string,
  to?: string,
): Promise<VehicleAvailability | null> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const query = params.toString();
  const path = `/vehicles/${vehicleId}/availability${query ? `?${query}` : ""}`;

  try {
    return await api.get<VehicleAvailability>(path);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err && err.status === 404) {
      return null;
    }
    throw err;
  }
}

/**
 * Check if a vehicle is available for a date range.
 */
export async function checkAvailability(
  vehicleId: string,
  startDate: string,
  endDate: string,
  excludeReservationId?: string,
): Promise<AvailabilityCheck> {
  const params = new URLSearchParams({
    vehicleId,
    startDate,
    endDate,
  });
  if (excludeReservationId) params.set("excludeReservationId", excludeReservationId);
  return api.get<AvailabilityCheck>(`/availability/check?${params}`);
}

/**
 * Create an availability block (admin).
 */
export async function createAvailabilityBlock(
  request: CreateAvailabilityBlockRequest,
): Promise<AvailabilityBlock> {
  return api.post<AvailabilityBlock>("/admin/availability-blocks", request);
}

/**
 * Delete an availability block (admin).
 */
export async function deleteAvailabilityBlock(id: string): Promise<void> {
  return api.delete<void>(`/admin/availability-blocks/${id}`);
}
