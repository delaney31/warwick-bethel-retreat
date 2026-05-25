"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ReservationDbStatus } from "@/lib/reservations/status";
import { fetchHostReservations, type HostReservation } from "@/lib/admin/api";
import { filterHostReservations } from "@/lib/admin/filter-reservations";
import { HOST_STATUS_LABELS, HOST_STATUS_ORDER } from "@/lib/admin/status";
import { HostReservationCard } from "@/components/admin/host-reservation-card";
import { HostDashboardToolbar } from "@/components/admin/host-dashboard-toolbar";
import { HostStatGrid } from "@/components/admin/host-stat-grid";

export function HostCommandCenter() {
  const [reservations, setReservations] = useState<HostReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationDbStatus | "all">("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchHostReservations();
      setReservations(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load reservations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => filterHostReservations(reservations, { query, status: statusFilter }),
    [reservations, query, statusFilter],
  );

  const grouped = useMemo(() => {
    const map = new Map<ReservationDbStatus, HostReservation[]>();
    for (const s of HOST_STATUS_ORDER) map.set(s, []);
    for (const r of filtered) {
      map.get(r.status)?.push(r);
    }
    return map;
  }, [filtered]);

  const stats = useMemo(() => {
    const pending = reservations.filter((r) => r.status === ReservationDbStatus.PENDING_REVIEW);
    const awaiting = reservations.filter(
      (r) => r.status === ReservationDbStatus.APPROVED_AWAITING_PAYMENT,
    );
    const confirmed = reservations.filter((r) => r.status === ReservationDbStatus.PAID_CONFIRMED);
    const pipeline = awaiting.reduce((s, r) => s + r.totalAmount, 0);
    const booked = confirmed.reduce((s, r) => s + r.totalAmount, 0);
    return {
      pendingCount: pending.length,
      awaitingCount: awaiting.length,
      confirmedCount: confirmed.length,
      pipeline,
      booked,
    };
  }, [reservations]);

  const handleUpdated = (updated: HostReservation) => {
    setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const showGrouped = statusFilter === "all";

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
          Host dashboard
        </p>
        <h1 className="mt-2 font-serif text-4xl font-light tracking-tight text-stone-900 md:text-5xl">
          Reservations
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
          Review guest requests, approve stays, send Stripe payment links, and confirm bookings —
          your private boutique hospitality command center.
        </p>
      </header>

      <HostStatGrid
        pendingCount={stats.pendingCount}
        awaitingCount={stats.awaitingCount}
        confirmedCount={stats.confirmedCount}
        totalCount={reservations.length}
        pipeline={stats.pipeline}
        booked={stats.booked}
      />

      <div className="mt-8">
        <HostDashboardToolbar
          query={query}
          onQueryChange={setQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          resultCount={filtered.length}
          totalCount={reservations.length}
          onRefresh={() => void load()}
          refreshing={loading}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </p>
      )}

      {loading && reservations.length === 0 ? (
        <div className="mt-10 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-stone-200/40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white/60 px-8 py-16 text-center">
          <p className="font-serif text-xl font-light text-stone-700">
            {reservations.length === 0 ? "No reservation requests yet" : "No matches for your filters"}
          </p>
          <p className="mt-2 text-sm text-stone-500">
            {reservations.length === 0
              ? "When guests submit from the booking page, they appear here from your database."
              : "Try clearing search or choosing a different status."}
          </p>
        </div>
      ) : showGrouped ? (
        <div className="mt-10 space-y-14">
          {HOST_STATUS_ORDER.map((status) => {
            const items = grouped.get(status) ?? [];
            if (items.length === 0) return null;
            return (
              <section key={status}>
                <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-stone-200/60 pb-3">
                  <h2 className="font-serif text-xl font-light text-stone-800">
                    {HOST_STATUS_LABELS[status]}
                  </h2>
                  <span className="text-xs font-medium uppercase tracking-widest text-stone-400">
                    {items.length} {items.length === 1 ? "stay" : "stays"}
                  </span>
                </div>
                <div className="space-y-5">
                  {items.map((r) => (
                    <HostReservationCard key={r.id} reservation={r} onUpdated={handleUpdated} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          {filtered.map((r) => (
            <HostReservationCard key={r.id} reservation={r} onUpdated={handleUpdated} />
          ))}
        </div>
      )}
    </div>
  );
}
