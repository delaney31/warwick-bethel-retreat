"use client";

import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchBookingAvailability,
  fetchBookingQuote,
  isBookingApiError,
  submitBookingRequest,
  type BookingQuote,
  type BookingSubmitSuccess,
} from "@/lib/api/booking-public";
import { MAX_GUESTS } from "@/lib/constants";
import {
  validateBookingForm,
  todayISO,
  type FieldError,
} from "@/lib/validation/booking";
import type { BookingRequestFormData } from "@/types/reservation";
import { ReservationStatus } from "@/types/reservation";
import { useReservationStore } from "@/lib/store/reservation-store";
import { StaySummaryCard } from "@/components/public/stay-summary-card";
import { BookingConfirmation } from "@/components/public/booking-confirmation";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const EMPTY: BookingRequestFormData = {
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  checkIn: "",
  checkOut: "",
  guestCount: "2",
  guestNotes: "",
};

type AvailabilityState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "available"; message?: string }
  | { status: "unavailable"; reason: string }
  | { status: "error"; message: string };

function BookingRequestFormInner() {
  const searchParams = useSearchParams();
  const datesFromCalendar = useRef(false);
  const { addReservation } = useReservationStore();
  const [form, setForm] = useState<BookingRequestFormData>(EMPTY);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<BookingSubmitSuccess | null>(null);
  const [availability, setAvailability] = useState<AvailabilityState>({ status: "idle" });
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [prefilledFromCalendar, setPrefilledFromCalendar] = useState(false);

  useEffect(() => {
    const checkIn = searchParams.get("checkIn")?.trim();
    const checkOut = searchParams.get("checkOut")?.trim();
    if (!checkIn || !checkOut || checkOut <= checkIn || datesFromCalendar.current) return;
    datesFromCalendar.current = true;
    setForm((prev) => ({ ...prev, checkIn, checkOut }));
    setPrefilledFromCalendar(true);
  }, [searchParams]);

  function fieldError(field: keyof BookingRequestFormData) {
    return errors.find((e) => e.field === field)?.message;
  }

  function update<K extends keyof BookingRequestFormData>(field: K, value: BookingRequestFormData[K]) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => p.filter((e) => e.field !== field));
    setSubmitError(null);
    if (field === "checkIn" || field === "checkOut") {
      setAvailability({ status: "idle" });
      setQuote(null);
    }
    if (field === "guestCount") setQuote(null);
  }

  useEffect(() => {
    if (!form.checkIn || !form.checkOut) return;
    const timer = setTimeout(() => {
      setAvailability({ status: "loading" });
      fetchBookingAvailability({ checkIn: form.checkIn, checkOut: form.checkOut })
        .then((r) => {
          if (isBookingApiError(r)) {
            if ("softFail" in r && (r as { softFail?: boolean }).softFail) {
              setAvailability({
                status: "available",
                message:
                  "Calendar could not be checked right now — you may still submit your request.",
              });
              return;
            }
            setAvailability({
              status: "error",
              message: r.error,
            });
            return;
          }
          if (r.isAvailable) setAvailability({ status: "available" });
          else
            setAvailability({
              status: "unavailable",
              reason: r.reason ?? "Those dates are not available for a confirmed stay.",
            });
        })
        .catch(() =>
          setAvailability({
            status: "available",
            message:
              "Calendar could not be checked right now — you may still submit your request.",
          }),
        );
    }, 400);
    return () => clearTimeout(timer);
  }, [form.checkIn, form.checkOut]);

  useEffect(() => {
    if (!form.checkIn || !form.checkOut) return;
    const guests = parseInt(form.guestCount, 10);
    if (!guests || guests < 1) return;

    const timer = setTimeout(() => {
      setQuoteLoading(true);
      fetchBookingQuote({ checkIn: form.checkIn, checkOut: form.checkOut, guestCount: guests })
        .then((r) => {
          if (isBookingApiError(r)) {
            setQuote(null);
            return;
          }
          setQuote(r);
        })
        .catch(() => setQuote(null))
        .finally(() => setQuoteLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [form.checkIn, form.checkOut, form.guestCount]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validateBookingForm(form, MAX_GUESTS);
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }
    if (availability.status === "unavailable") return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitBookingRequest({
        guestName: form.guestName.trim(),
        guestEmail: form.guestEmail.trim(),
        guestPhone: form.guestPhone.trim(),
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guestCount: parseInt(form.guestCount, 10),
        guestNotes: form.guestNotes.trim(),
      });

      if (isBookingApiError(result)) {
        if (result.fields?.length) setErrors(result.fields);
        setSubmitError(result.error);
        return;
      }

      addReservation({
        id: result.id,
        vehicleId: "",
        vehicleDisplayName: "Warwick Bethel Retreat",
        status: ReservationStatus.PendingReview,
        renterName: result.guestName,
        email: form.guestEmail,
        phone: form.guestPhone,
        startDate: result.checkIn,
        endDate: result.checkOut,
        pickupPreference: "santa_monica",
        driverAge: result.guestCount,
        notes: form.guestNotes,
        rentalDays: result.nights,
        dailyRateAtBooking: 150,
        subtotal: result.subtotal,
        createdAt: new Date().toISOString(),
      });
      setSuccess({
        ...result,
        message:
          "Your request has been received. We'll review your stay and follow up with payment instructions if approved.",
      });
    } catch {
      setSubmitError(
        "We couldn't submit your request. Please check your details and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return <BookingConfirmation success={success} />;
  }

  const canSubmit =
    availability.status !== "unavailable" &&
    !submitting &&
    !(availability.status === "loading" || quoteLoading);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
      <form
        onSubmit={onSubmit}
        className="rounded-3xl border border-stone-200/60 bg-white/80 p-6 shadow-xl shadow-stone-900/5 backdrop-blur-sm md:p-8"
      >
        {prefilledFromCalendar && form.checkIn && form.checkOut && (
          <p className="mb-6 rounded-xl border border-sage-200/80 bg-sage-50/90 px-4 py-3 text-sm text-sage-900">
            Dates selected from our availability calendar.
          </p>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-lg font-light text-stone-900">Your details</h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <FormField
                label="Full name"
                name="guestName"
                value={form.guestName}
                onChange={(e) => update("guestName", e.target.value)}
                error={fieldError("guestName")}
                required
              />
              <FormField
                label="Email"
                name="guestEmail"
                type="email"
                value={form.guestEmail}
                onChange={(e) => update("guestEmail", e.target.value)}
                error={fieldError("guestEmail")}
                required
              />
              <FormField
                label="Phone"
                name="guestPhone"
                type="tel"
                value={form.guestPhone}
                onChange={(e) => update("guestPhone", e.target.value)}
                error={fieldError("guestPhone")}
                required
                className="sm:col-span-2"
              />
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-light text-stone-900">Your stay</h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <FormField
                label="Guests"
                name="guestCount"
                as="select"
                value={form.guestCount}
                onChange={(e) => update("guestCount", e.target.value)}
                error={fieldError("guestCount")}
              >
                {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={String(n)}>
                    {n} guest{n > 1 ? "s" : ""}
                  </option>
                ))}
              </FormField>
              <div className="hidden sm:block" aria-hidden />
              <FormField
                label="Check-in"
                name="checkIn"
                type="date"
                min={todayISO()}
                value={form.checkIn}
                onChange={(e) => update("checkIn", e.target.value)}
                error={fieldError("checkIn")}
                required
              />
              <FormField
                label="Check-out"
                name="checkOut"
                type="date"
                min={form.checkIn || todayISO()}
                value={form.checkOut}
                onChange={(e) => update("checkOut", e.target.value)}
                error={fieldError("checkOut")}
                required
              />
            </div>
          </div>

          <FormField
            label="Notes for your host"
            name="guestNotes"
            as="textarea"
            rows={4}
            value={form.guestNotes}
            onChange={(e) => update("guestNotes", e.target.value)}
            hint="Arrival time, special requests, or questions — optional."
          />
        </div>

        {submitError && (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className={cn("mt-8 w-full", submitting && "opacity-70")}
          disabled={!canSubmit}
        >
          {submitting ? "Submitting your request…" : "Submit reservation request"}
        </Button>

        <p className="mt-4 text-center text-xs text-stone-400">
          No payment today — host approval required before checkout.
        </p>
      </form>

      <StaySummaryCard
        checkIn={form.checkIn}
        checkOut={form.checkOut}
        guestCount={form.guestCount}
        quote={quote}
        quoteLoading={quoteLoading}
        availability={availability}
      />
    </div>
  );
}

function BookingFormFallback() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div className="h-[32rem] animate-pulse rounded-3xl bg-stone-200/50" />
      <div className="h-[28rem] animate-pulse rounded-3xl bg-stone-200/50" />
    </div>
  );
}

export function BookingRequestForm() {
  return (
    <Suspense fallback={<BookingFormFallback />}>
      <BookingRequestFormInner />
    </Suspense>
  );
}
