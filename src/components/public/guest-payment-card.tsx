"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/validation/booking";
import { startGuestCheckout, type GuestReservationView } from "@/lib/guest/payment-api";
import { Button } from "@/components/ui/button";

export function GuestPaymentCard({ reservation }: { reservation: GuestReservationView }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function payNow() {
    setLoading(true);
    setError(null);
    const result = await startGuestCheckout(reservation.id);
    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }
    window.location.href = result.checkoutUrl;
  }

  return (
    <div className="glass-panel rounded-2xl p-8 shadow-xl">
      <dl className="space-y-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-stone-500">Guest</dt>
          <dd className="font-medium text-stone-900">{reservation.guestName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone-500">Dates</dt>
          <dd className="text-right font-medium text-stone-900">
            {reservation.checkIn} → {reservation.checkOut}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone-500">Nights</dt>
          <dd>{reservation.nights}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone-500">Guests</dt>
          <dd>{reservation.guestCount}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-stone-200 pt-4 text-lg">
          <dt className="font-medium text-stone-800">Total due</dt>
          <dd className="font-serif text-2xl font-light text-stone-900">
            {formatCurrency(reservation.totalAmount)}
          </dd>
        </div>
      </dl>

      {reservation.canPay && (
        <>
          <p className="mt-6 text-sm leading-relaxed text-stone-600">
            Pay securely with Stripe Checkout — credit card, debit card, and Apple Pay where
            available. Your card details are never stored on our site.
          </p>
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          <Button className="mt-6 w-full" size="lg" disabled={loading} onClick={payNow}>
            {loading ? "Redirecting to secure checkout…" : "Pay in full"}
          </Button>
        </>
      )}

      {reservation.isPendingReview && (
        <p className="mt-6 text-sm text-amber-900">
          Your request is with our host for personal review. We will email you at{" "}
          <strong>{reservation.email}</strong> when your stay is approved and ready for payment.
        </p>
      )}

      {reservation.isRejected && (
        <p className="mt-6 text-sm text-stone-600">
          This request was not approved for the selected dates. Please contact us if you have
          questions.
        </p>
      )}

      {reservation.isCancelled && (
        <p className="mt-6 text-sm text-stone-600">This reservation has been cancelled.</p>
      )}
    </div>
  );
}
