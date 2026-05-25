"use client";

import { useState } from "react";
import {
  updateReservationStatus,
  mapFrontendReservationStatusToApi,
  getApiErrorMessage,
} from "@/lib/api";
import {
  ReservationStatus,
  RESERVATION_STATUS_LABELS,
  type Reservation,
} from "@/types/reservation";
import { getAllowedTransitions } from "@/lib/store/reservation-store";
import { useReservationStore } from "@/lib/store/reservation-store";
import { ReservationStatusBadge } from "./status-badge";
import { formatCurrency } from "@/lib/validation/booking";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

export function ReservationPanel({
  reservation,
  onClose,
}: {
  reservation: Reservation;
  onClose: () => void;
}) {
  const { updateStatus, refreshReservationsFromApi } = useReservationStore();
  const [message, setMessage] = useState(reservation.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function transition(status: ReservationStatus) {
    setLoading(true);
    setError(null);
    try {
      await updateReservationStatus(reservation.id, {
        status: mapFrontendReservationStatusToApi(status),
        message: message || undefined,
      });
      updateStatus(reservation.id, status);
      await refreshReservationsFromApi();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const allowed = getAllowedTransitions(reservation.status);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-stone-200 bg-white shadow-2xl">
      <div className="flex h-full flex-col overflow-y-auto p-6">
        <div className="flex items-start justify-between">
          <div>
            <ReservationStatusBadge status={reservation.status} />
            <h2 className="mt-3 text-xl font-light">{reservation.renterName}</h2>
            <p className="text-sm text-stone-500">{reservation.email}</p>
          </div>
          <button type="button" onClick={onClose} className="text-stone-400 hover:text-stone-900">✕</button>
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <div><dt className="text-[11px] uppercase tracking-widest text-stone-400">Dates</dt><dd>{reservation.startDate} → {reservation.endDate} ({reservation.rentalDays} nights)</dd></div>
          <div><dt className="text-[11px] uppercase tracking-widest text-stone-400">Guests</dt><dd>{reservation.driverAge}</dd></div>
          <div><dt className="text-[11px] uppercase tracking-widest text-stone-400">Total</dt><dd>{formatCurrency(reservation.subtotal)}</dd></div>
          {reservation.notes && <div><dt className="text-[11px] uppercase tracking-widest text-stone-400">Guest notes</dt><dd>{reservation.notes}</dd></div>}
        </dl>

        <FormField className="mt-6" label="Message to guest" name="message" as="textarea" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 space-y-2">
          {allowed.map((status) => (
            <Button
              key={status}
              variant={status === ReservationStatus.Rejected ? "danger" : "primary"}
              className="w-full"
              disabled={loading}
              onClick={() => transition(status)}
            >
              {status === ReservationStatus.AwaitingPayment ? "Approve → Awaiting Payment" : RESERVATION_STATUS_LABELS[status]}
            </Button>
          ))}
        </div>

        {reservation.status === ReservationStatus.AwaitingPayment && (
          <p className="mt-4 text-xs text-stone-500">
            Create a payment in Admin → Payments, then mark paid to confirm (or integrate Stripe checkout).
          </p>
        )}
      </div>
    </div>
  );
}
