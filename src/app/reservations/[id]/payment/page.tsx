"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/pricing";
import { ReservationStatus, RESERVATION_STATUS_LABELS } from "@/types/reservation";
import { Button } from "@/components/ui/button";

export default function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}) {
  const { id } = use(params);
  const query = use(searchParams);
  const [data, setData] = useState<{
    reservation: { status: ReservationStatus; guestName: string; totalCents: number; nights: number; checkIn: string; checkOut: string };
    payment: { status: string; stripeCheckoutSessionId: string | null } | null;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/reservations/${id}`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  if (!data) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-stone-50">
        <p className="text-stone-500">Loading…</p>
      </div>
    );
  }

  const { reservation } = data;

  if (query.success === "1" || reservation.status === ReservationStatus.Confirmed) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-stone-950 px-4 text-center text-white">
        <p className="text-[11px] uppercase tracking-widest text-amber-400">Confirmed</p>
        <h1 className="mt-4 font-serif text-3xl font-light">Your retreat is booked</h1>
        <p className="mt-4 max-w-md text-sm text-white/70">
          Thank you, {reservation.guestName}. Your dates are secured — we look forward to hosting you.
        </p>
        <Link href="/" className="mt-8 text-amber-400 hover:text-amber-300">Return home →</Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-stone-50">
      <div className="bg-stone-950 px-4 py-16 text-center text-white md:py-20">
        <p className="text-[11px] uppercase tracking-widest text-amber-400">Payment</p>
        <h1 className="mt-3 font-serif text-3xl font-light">Complete your reservation</h1>
        <p className="mt-2 text-sm text-white/60">
          {RESERVATION_STATUS_LABELS[reservation.status]}
        </p>
      </div>
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="glass-panel rounded-2xl p-8 shadow-xl">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-stone-500">Dates</dt><dd>{reservation.checkIn} → {reservation.checkOut}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Nights</dt><dd>{reservation.nights}</dd></div>
            <div className="flex justify-between border-t border-stone-200 pt-3 text-lg"><dt>Total due</dt><dd className="font-medium">{formatCurrency(reservation.totalCents)}</dd></div>
          </dl>
          {reservation.status === ReservationStatus.AwaitingPayment && (
            <p className="mt-6 text-sm text-stone-600">
              Check your email for the secure Stripe checkout link supporting credit card and Apple Pay.
              If you need the link resent, contact your host.
            </p>
          )}
          {query.cancelled === "1" && (
            <p className="mt-4 text-sm text-amber-800">Payment was cancelled. Use the link in your approval email to try again.</p>
          )}
          <Button href="/" variant="secondary" className="mt-8 w-full">Back to site</Button>
        </div>
      </div>
    </div>
  );
}
