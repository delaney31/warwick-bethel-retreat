"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { getReservations, getApiErrorMessage } from "@/lib/api";
import { mapReservationSummaryToReservation } from "@/lib/api/reservations";
import { formatCurrency } from "@/lib/validation/booking";
import { ReservationStatus } from "@/types/reservation";

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState<{ guest: string; total: number; status: string; id: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getReservations()
      .then((list) =>
        setRows(
          list.map((s) => {
            const r = mapReservationSummaryToReservation(s);
            return { id: r.id, guest: r.renterName, total: r.subtotal, status: r.status };
          }),
        ),
      )
      .catch((e) => setError(getApiErrorMessage(e)));
  }, []);

  const awaiting = rows.filter((r) => r.status === ReservationStatus.AwaitingPayment);

  return (
    <div>
      <PageHeader title="Payments" description="Mark payments in Pacific Luxe admin when Stripe is wired" />
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <p className="mt-4 text-sm text-stone-600">
        Use POST /api/admin/reservations/{"{id}"}/payments in the admin API to record charges, then mark paid to confirm.
      </p>
      <div className="mt-8 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-stone-50/80 text-[11px] uppercase tracking-widest text-stone-400">
            <tr>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {awaiting.map((r) => (
              <tr key={r.id} className="border-b border-stone-50">
                <td className="px-4 py-3">{r.guest}</td>
                <td className="px-4 py-3">{formatCurrency(r.total)}</td>
                <td className="px-4 py-3">{r.status}</td>
              </tr>
            ))}
            {awaiting.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-stone-500">
                  No reservations awaiting payment
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
