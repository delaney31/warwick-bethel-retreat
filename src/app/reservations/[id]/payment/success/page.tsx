"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { PaymentShell } from "@/components/public/payment-shell";
import { fetchGuestReservation, type GuestReservationView } from "@/lib/guest/payment-api";
import { formatCurrency } from "@/lib/validation/booking";

export default function PaymentSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { id } = use(params);
  const { session_id: sessionId } = use(searchParams);
  const [reservation, setReservation] = useState<GuestReservationView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      for (let i = 0; i < 8 && !cancelled; i++) {
        const r = await fetchGuestReservation(id);
        if (r?.isPaid) {
          setReservation(r);
          setLoading(false);
          return;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
      const r = await fetchGuestReservation(id);
      if (!cancelled) {
        setReservation(r);
        setLoading(false);
      }
    }
    void poll();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-stone-950 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
        <p className="text-sm text-white/70">Confirming your payment…</p>
      </div>
    );
  }

  const confirmed = reservation?.isPaid;

  return (
    <PaymentShell
      dark
      eyebrow={confirmed ? "Payment received" : "Almost there"}
      title={confirmed ? "Your retreat is booked" : "Payment received — confirming"}
      subtitle={
        confirmed
          ? `Thank you, ${reservation?.guestName ?? "guest"}. Your stay is confirmed on our calendar.`
          : "Stripe has processed your payment. Your confirmation will appear shortly — refresh this page in a moment."
      }
    >
      <div className="mx-auto max-w-md text-center text-sm text-white/70">
        {reservation && (
          <>
            <p>
              {reservation.checkIn} → {reservation.checkOut}
            </p>
            <p className="mt-2">
              {reservation.nights} night{reservation.nights !== 1 ? "s" : ""} ·{" "}
              {formatCurrency(reservation.totalAmount)}
            </p>
          </>
        )}
        {sessionId && (
          <p className="mt-6 font-mono text-[10px] text-white/40">Reference: {sessionId.slice(0, 20)}…</p>
        )}
        {!confirmed && (
          <button
            type="button"
            className="mt-6 text-amber-400 underline-offset-2 hover:underline"
            onClick={() => window.location.reload()}
          >
            Refresh status
          </button>
        )}
        {confirmed && (
          <p className="mt-6 text-white/50">
            A confirmation email will follow from your host. We look forward to welcoming you.
          </p>
        )}
        <Link href="/" className="mt-8 inline-block text-amber-400 hover:text-amber-300">
          Return home →
        </Link>
      </div>
    </PaymentShell>
  );
}
