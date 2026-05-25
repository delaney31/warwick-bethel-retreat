"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { PaymentShell } from "@/components/public/payment-shell";
import { GuestPaymentCard } from "@/components/public/guest-payment-card";
import { fetchGuestReservation, type GuestReservationView } from "@/lib/guest/payment-api";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [reservation, setReservation] = useState<GuestReservationView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuestReservation(id)
      .then(setReservation)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-stone-50">
        <p className="text-stone-500">Loading…</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <PaymentShell eyebrow="Payment" title="Reservation not found" subtitle="This link may be invalid.">
        <p className="text-center text-sm text-stone-600">
          <Link href="/contact" className="text-sage-700 underline">
            Contact your host
          </Link>
        </p>
      </PaymentShell>
    );
  }

  return (
    <PaymentShell
      eyebrow="Payment cancelled"
      title="No worries — your dates are still held"
      subtitle="You left Stripe Checkout before completing payment. Your approved reservation is unchanged; pay when you are ready."
    >
      <div className="mb-6 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Payment was not completed. Use the button below to return to secure checkout, or use the link
        your host sent you.
      </div>
      {reservation.canPay ? (
        <GuestPaymentCard reservation={reservation} />
      ) : (
        <div className="glass-panel rounded-2xl p-8 text-center text-sm text-stone-600">
          <p>Online payment is not available for this reservation right now.</p>
          <Button href="/contact" variant="secondary" className="mt-6">
            Contact host
          </Button>
        </div>
      )}
    </PaymentShell>
  );
}
