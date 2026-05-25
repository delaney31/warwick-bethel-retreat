"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  createReservation,
  checkAvailability,
  getVehicleBySlug,
  getApiErrorMessage,
} from "@/lib/api";
import { RETREAT_SLUG, MAX_GUESTS } from "@/lib/constants";
import {
  validateBookingForm,
  calculateRetreatPricing,
  formatCurrency,
  todayISO,
  type FieldError,
} from "@/lib/validation/booking";
import type { BookingRequestFormData, Reservation } from "@/types/reservation";
import { useReservationStore } from "@/lib/store/reservation-store";
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
  | { status: "available" }
  | { status: "unavailable"; reason: string }
  | { status: "error"; message: string };

export function BookingRequestForm() {
  const { addReservation } = useReservationStore();
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [form, setForm] = useState<BookingRequestFormData>(EMPTY);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Reservation | null>(null);
  const [availability, setAvailability] = useState<AvailabilityState>({ status: "idle" });

  useEffect(() => {
    getVehicleBySlug(RETREAT_SLUG).then((v) => {
      if (v) setVehicleId(v.id);
    });
  }, []);

  const pricing = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return null;
    const nights = Math.max(
      0,
      Math.floor(
        (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000,
      ),
    );
    if (nights <= 0) return null;
    return calculateRetreatPricing(parseInt(form.guestCount, 10) || 2, nights);
  }, [form.checkIn, form.checkOut, form.guestCount]);

  function fieldError(field: keyof BookingRequestFormData) {
    return errors.find((e) => e.field === field)?.message;
  }

  function update<K extends keyof BookingRequestFormData>(field: K, value: BookingRequestFormData[K]) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => p.filter((e) => e.field !== field));
    setSubmitError(null);
    if (field === "checkIn" || field === "checkOut") setAvailability({ status: "idle" });
  }

  useEffect(() => {
    if (!vehicleId || !form.checkIn || !form.checkOut) return;
    const timer = setTimeout(() => {
      setAvailability({ status: "loading" });
      checkAvailability(vehicleId, form.checkIn, form.checkOut)
        .then((r) => {
          if (r.isAvailable) setAvailability({ status: "available" });
          else setAvailability({ status: "unavailable", reason: r.reason ?? "Dates unavailable" });
        })
        .catch(() => setAvailability({ status: "error", message: "Could not check availability." }));
    }, 400);
    return () => clearTimeout(timer);
  }, [vehicleId, form.checkIn, form.checkOut]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!vehicleId) {
      setSubmitError("Property is not available. Is the retreat API running?");
      return;
    }
    const validationErrors = validateBookingForm(form, MAX_GUESTS);
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }
    if (availability.status === "unavailable") return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await createReservation({
        vehicleId,
        renterName: form.guestName.trim(),
        renterEmail: form.guestEmail.trim(),
        renterPhone: form.guestPhone.trim(),
        startDate: form.checkIn,
        endDate: form.checkOut,
        pickupPreference: "SantaMonica",
        driverAge: parseInt(form.guestCount, 10),
        notes: form.guestNotes.trim(),
      });
      const reservation: Reservation = {
        id: created.id,
        vehicleId,
        vehicleDisplayName: "Warwick Bethel Retreat",
        status: "pending_review" as Reservation["status"],
        renterName: form.guestName,
        email: form.guestEmail,
        phone: form.guestPhone,
        startDate: form.checkIn,
        endDate: form.checkOut,
        pickupPreference: "santa_monica",
        driverAge: parseInt(form.guestCount, 10),
        notes: form.guestNotes,
        rentalDays: pricing?.nights ?? 1,
        dailyRateAtBooking: 150,
        subtotal: pricing?.subtotal ?? 0,
        createdAt: new Date().toISOString(),
      };
      addReservation(reservation);
      setSuccess(reservation);
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center shadow-xl">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-600">Request received</p>
        <h3 className="mt-3 text-2xl font-light text-stone-900">Thank you, {success.renterName}</h3>
        <p className="mt-4 text-sm text-stone-600">
          Status: <strong>Pending Review</strong>. Reference:{" "}
          <span className="font-mono text-xs">{success.id}</span>
        </p>
        <p className="mt-4 text-sm text-stone-500">
          Estimated total: {formatCurrency(success.subtotal)} · {success.rentalDays} night(s)
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel space-y-6 rounded-2xl p-6 shadow-xl md:p-8">
      {!vehicleId && (
        <p className="text-sm text-amber-800">
          Connecting to reservation API… Start the retreat API on port 5002 if this persists.
        </p>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Full name" name="guestName" value={form.guestName} onChange={(e) => update("guestName", e.target.value)} error={fieldError("guestName")} required />
        <FormField label="Email" name="guestEmail" type="email" value={form.guestEmail} onChange={(e) => update("guestEmail", e.target.value)} error={fieldError("guestEmail")} required />
        <FormField label="Phone" name="guestPhone" type="tel" value={form.guestPhone} onChange={(e) => update("guestPhone", e.target.value)} />
        <FormField label="Guests" name="guestCount" as="select" value={form.guestCount} onChange={(e) => update("guestCount", e.target.value)} error={fieldError("guestCount")}>
          {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
            <option key={n} value={String(n)}>{n} guest{n > 1 ? "s" : ""}</option>
          ))}
        </FormField>
        <FormField label="Check-in" name="checkIn" type="date" min={todayISO()} value={form.checkIn} onChange={(e) => update("checkIn", e.target.value)} error={fieldError("checkIn")} required />
        <FormField label="Check-out" name="checkOut" type="date" min={form.checkIn || todayISO()} value={form.checkOut} onChange={(e) => update("checkOut", e.target.value)} error={fieldError("checkOut")} required />
      </div>
      <FormField label="Notes for your host" name="guestNotes" as="textarea" rows={4} value={form.guestNotes} onChange={(e) => update("guestNotes", e.target.value)} />

      {availability.status === "loading" && <p className="text-sm text-stone-500">Checking availability…</p>}
      {availability.status === "available" && <p className="text-sm text-sage-700">✓ Dates appear available</p>}
      {availability.status === "unavailable" && <p className="text-sm text-red-600">{availability.reason}</p>}

      {pricing && (
        <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-500">Estimated total</p>
          <p className="mt-1 text-2xl font-light text-stone-900">{formatCurrency(pricing.subtotal)}</p>
          <p className="mt-1 text-xs text-stone-500">
            {pricing.nights} night(s) · $150/night for 2 guests
            {pricing.extraGuests > 0 && ` · +$25/night × ${pricing.extraGuests} extra`}
          </p>
        </div>
      )}

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <Button type="submit" size="lg" className={cn("w-full", submitting && "opacity-70")} disabled={submitting || !vehicleId || availability.status === "unavailable"}>
        {submitting ? "Submitting…" : "Submit Reservation Request"}
      </Button>
    </form>
  );
}
