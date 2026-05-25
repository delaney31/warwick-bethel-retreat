"use client";

import { use, useEffect, useState } from "react";
import { PaymentShell } from "@/components/public/payment-shell";
import { GuestPaymentCard } from "@/components/public/guest-payment-card";
import { fetchGuestReservation, type GuestReservationView } from "@/lib/guest/payment-api";
import Link from "next/link";

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
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
        <p className="text-stone-500">Loading your reservation…</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <PaymentShell
        eyebrow="Payment"
        title="Reservation not found"
        subtitle="This link may be invalid or expired."
      >
        <p className="text-center text-sm text-stone-600">
          <Link href="/contact" className="text-sage-700 underline">
            Contact your host
          </Link>{" "}
          for assistance.
        </p>
      </PaymentShell>
    );
  }

  if (reservation.isPaid) {
    return (
      <PaymentShell
        dark
        eyebrow="Confirmed"
        title="Your retreat is booked"
        subtitle={`Thank you, ${reservation.guestName}. Your dates are secured — we look forward to hosting you.`}
      >
        <p className="text-center text-sm text-white/60">
          {reservation.checkIn} → {reservation.checkOut} · {formatStay(reservation)}
        </p>
      </PaymentShell>
    );
  }

  return (
    <PaymentShell
      eyebrow="Secure payment"
      title="Complete your reservation"
      subtitle="Full payment confirms your dates on our calendar."
    >
      <GuestPaymentCard reservation={reservation} />
    </PaymentShell>
  );
}

function formatStay(r: GuestReservationView) {
  return `${r.nights} night${r.nights !== 1 ? "s" : ""} · ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(r.totalAmount)}`;
}
