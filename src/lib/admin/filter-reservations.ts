import type { ReservationDbStatus } from "@/lib/reservations/status";
import type { HostReservation } from "./api";

export interface ReservationFilters {
  query: string;
  status: ReservationDbStatus | "all";
}

export function filterHostReservations(
  rows: HostReservation[],
  filters: ReservationFilters,
): HostReservation[] {
  const q = filters.query.trim().toLowerCase();

  return rows.filter((r) => {
    if (filters.status !== "all" && r.status !== filters.status) return false;
    if (!q) return true;

    const haystack = [
      r.id,
      r.guestName,
      r.email,
      r.phone,
      r.notes ?? "",
      r.checkIn,
      r.checkOut,
      r.status,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}
