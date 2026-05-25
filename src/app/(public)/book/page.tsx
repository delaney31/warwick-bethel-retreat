import type { Metadata } from "next";
import { BookingRequestForm } from "@/components/public/booking-request-form";

export const metadata: Metadata = {
  title: "Reserve Your Stay",
  description: "Submit a reservation request — $150/night for 2 guests, host approval, secure Stripe payment.",
};

export default function BookPage() {
  return (
    <div className="bg-gradient-to-b from-stone-100 to-stone-50 pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-4 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600">Reservation</p>
        <h1 className="mt-3 font-serif text-4xl font-light text-stone-900">Request your stay</h1>
        <p className="mt-4 text-sm text-stone-600">
          Select dates and guests. Our host personally reviews every request. After approval,
          pay securely with credit card or Apple Pay — dates confirm upon payment.
        </p>
        <div className="mt-10">
          <BookingRequestForm />
        </div>
      </div>
    </div>
  );
}
