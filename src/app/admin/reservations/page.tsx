"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { ReservationStatusBadge } from "@/components/admin/status-badge";
import { ReservationPanel } from "@/components/admin/reservation-panel";
import { useReservationStore } from "@/lib/store/reservation-store";
import { formatCurrency } from "@/lib/validation/booking";
import type { Reservation } from "@/types/reservation";

export default function AdminReservationsPage() {
  const { reservations, isLoaded, refreshReservationsFromApi } = useReservationStore();
  const [selected, setSelected] = useState<Reservation | null>(null);

  useEffect(() => {
    void refreshReservationsFromApi();
  }, [refreshReservationsFromApi]);

  return (
    <div>
      <PageHeader title="Reservations" description="Approval queue" />
      {!isLoaded ? (
        <p className="mt-8 text-stone-500">Loading…</p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-100 bg-stone-50/80 text-[11px] uppercase tracking-widest text-stone-400">
              <tr>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="cursor-pointer border-b border-stone-50 hover:bg-stone-50/50" onClick={() => setSelected(r)}>
                  <td className="px-4 py-3 font-medium">{r.renterName}</td>
                  <td className="px-4 py-3 text-stone-600">{r.startDate} → {r.endDate}</td>
                  <td className="px-4 py-3">{formatCurrency(r.subtotal)}</td>
                  <td className="px-4 py-3"><ReservationStatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && <ReservationPanel reservation={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
