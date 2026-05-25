"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { useReservationStore } from "@/lib/store/reservation-store";
import { ReservationStatus } from "@/types/reservation";
import { formatCurrency } from "@/lib/validation/booking";

export default function AdminDashboardPage() {
  const { reservations, isLoaded, refreshReservationsFromApi, adminReservationsError } =
    useReservationStore();

  useEffect(() => {
    void refreshReservationsFromApi();
  }, [refreshReservationsFromApi]);

  const pending = reservations.filter((r) => r.status === ReservationStatus.PendingReview).length;
  const confirmed = reservations.filter((r) => r.status === ReservationStatus.Confirmed).length;
  const revenue = reservations
    .filter((r) => r.status === ReservationStatus.Confirmed || r.status === ReservationStatus.Completed)
    .reduce((s, r) => s + r.subtotal, 0);

  return (
    <div>
      <PageHeader title="Dashboard" description="Warwick Bethel Retreat · Pacific Luxe API" />
      {adminReservationsError && (
        <p className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{adminReservationsError}</p>
      )}
      {!isLoaded ? (
        <p className="mt-8 text-stone-500">Loading…</p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Pending review" value={String(pending)} />
            <StatCard label="Confirmed" value={String(confirmed)} />
            <StatCard label="Booked revenue" value={formatCurrency(revenue)} />
            <StatCard label="All reservations" value={String(reservations.length)} />
          </div>
          <div className="mt-10 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium">Recent</h2>
            <ul className="mt-4 divide-y divide-stone-100 text-sm">
              {reservations.slice(0, 5).map((r) => (
                <li key={r.id} className="flex justify-between py-3">
                  <span>{r.renterName} · {r.startDate}</span>
                  <span className="text-stone-500">{r.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
