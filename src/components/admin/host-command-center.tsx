"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ReservationDbStatus } from "@/lib/reservations";
import { fetchHostReservations, type HostReservation } from "@/lib/admin/api";
import { HOST_STATUS_LABELS, HOST_STATUS_ORDER } from "@/lib/admin/status";
import { HostReservationCard } from "@/components/admin/host-reservation-card";
import { formatCurrency } from "@/lib/validation/booking";

function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200/60 bg-white/80 px-5 py-4 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">{label}</p>
      <p className="mt-2 font-serif text-3xl font-light text-stone-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-stone-500">{sub}</p>}
    </div>
  );
}

export function HostCommandCenter() {
  const [reservations, setReservations] = useState<HostReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const grouped = useMemo(() => {
    const map = new Map<ReservationDbStatus, HostReservation[]>();
    for (const s of HOST_STATUS_ORDER) map.set(s, []);
    for (const r of reservations) {
      map.get(r.status)?.push(r);
    }
    return map;
  }, [reservations]);

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

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
          Host command center
        </p>
        <h1 className="mt-2 font-serif text-4xl font-light tracking-tight text-stone-900 md:text-5xl">
          Warwick Bethel Retreat
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600">
          Review guest requests, approve stays, send payment links, and confirm bookings — all
          from your private hospitality dashboard.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Pending review" value={String(stats.pendingCount)} sub="Needs your decision" />
        <StatTile
          label="Awaiting payment"
          value={String(stats.awaitingCount)}
          sub={stats.pipeline > 0 ? formatCurrency(stats.pipeline) + " pipeline" : undefined}
        />
        <StatTile
          label="Confirmed"
          value={String(stats.confirmedCount)}
          sub={stats.booked > 0 ? formatCurrency(stats.booked) + " secured" : undefined}
        />
        <StatTile label="All requests" value={String(reservations.length)} />
      </div>

      {error && (
        <p className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {loading ? (
        <div className="mt-12 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-stone-200/40" />
          ))}
        </div>
      ) : (
        <div className="mt-12 space-y-14">
          {HOST_STATUS_ORDER.map((status) => {
            const items = grouped.get(status) ?? [];
            if (items.length === 0) return null;
            return (
              <section key={status}>
                <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-stone-200/60 pb-3">
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
          {reservations.length === 0 && (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white/50 px-8 py-16 text-center">
              <p className="font-serif text-xl font-light text-stone-700">No reservation requests yet</p>
              <p className="mt-2 text-sm text-stone-500">
                When guests submit from the booking page, they will appear here grouped by status.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
