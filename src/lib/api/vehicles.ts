import { api } from "./client";
import type { VehicleSummary, VehicleDetail } from "./types/vehicle";

/**
 * Fetch all vehicles (public). Returns only available/displayable inventory.
 */
export async function getVehicles(): Promise<VehicleSummary[]> {
  return api.get<VehicleSummary[]>("/vehicles");
}

/**
 * Fetch all vehicles (admin). Returns all vehicles including offline/maintenance.
 * Optional status filter.
 */
export async function getAdminVehicles(status?: string): Promise<VehicleSummary[]> {
  const path = status
    ? `/admin/vehicles?status=${encodeURIComponent(status)}`
    : "/admin/vehicles";
  return api.get<VehicleSummary[]>(path);
}

/**
 * Update a vehicle (admin). Only provided fields are updated.
 */
export async function updateAdminVehicle(
  id: string,
  updates: { status?: string },
): Promise<VehicleDetail> {
  return api.put<VehicleDetail>(`/admin/vehicles/${id}`, updates);
}

/**
 * Fetch a vehicle by slug (public). Returns null if not found.
 */
export async function getVehicleBySlug(slug: string): Promise<VehicleDetail | null> {
  try {
    return await api.get<VehicleDetail>(`/vehicles/${slug}`);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err && err.status === 404) {
      return null;
    }
    throw err;
  }
}
