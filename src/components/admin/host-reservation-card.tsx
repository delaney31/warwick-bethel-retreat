"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Copy, CreditCard, Mail, Phone, Users } from "lucide-react";
import {
  approveHostReservation,
  createHostCheckoutSession,
  fetchHostPaymentLink,
  updateHostReservationStatus,
  type HostReservation,
} from "@/lib/admin/api";
import { ReservationDbStatus } from "@/lib/reservations";
import { HostStatusBadge } from "@/components/admin/host-status-badge";
import { formatCurrency } from "@/lib/validation/booking";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function HostReservationCard({
  reservation,
  onUpdated,
}: {
  reservation: HostReservation;
  onUpdated: (r: HostReservation) => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function runAction(key: string, fn: () => Promise<HostReservation | void>) {
    setLoading(key);
    setError(null);
    try {
      const result = await fn();
      if (result) onUpdated(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setLoading(null);
    }
  }

  async function copyPaymentLink() {
    setLoading("copy");
    setError(null);
    try {
      let url = checkoutUrl;
      if (!url) {
        const data = await fetchHostPaymentLink(reservation.id);
        url = data.checkoutUrl;
        setCheckoutUrl(url);
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not copy link.");
    } finally {
      setLoading(null);
    }
  }

  const createdLabel = format(parseISO(reservation.createdAt), "MMM d, yyyy · h:mm a");

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-stone-200/70 bg-gradient-to-br from-white to-stone-50/80 p-6 shadow-sm transition hover:shadow-md",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sage-300/50 to-transparent" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <HostStatusBadge status={reservation.status} />
          <h3 className="mt-3 font-serif text-2xl font-light tracking-tight text-stone-900">
            {reservation.guestName}
          </h3>
          <p className="mt-1 text-xs text-stone-400">Requested {createdLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400">Total</p>
          <p className="mt-1 font-serif text-3xl font-light text-stone-900">
            {formatCurrency(reservation.totalAmount)}
          </p>
          <p className="mt-0.5 text-xs text-stone-500">
            {reservation.nights} night{reservation.nights !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 text-sm text-stone-600">
          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" aria-hidden />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Stay</p>
            <p className="mt-0.5 font-medium text-stone-800">
              {reservation.checkIn} → {reservation.checkOut}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm text-stone-600">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" aria-hidden />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Guests</p>
            <p className="mt-0.5 font-medium text-stone-800">{reservation.guestCount}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm text-stone-600">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" aria-hidden />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Email</p>
            <a href={`mailto:${reservation.email}`} className="mt-0.5 block font-medium text-sage-800 hover:underline">
              {reservation.email}
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm text-stone-600">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" aria-hidden />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Phone</p>
            <a href={`tel:${reservation.phone}`} className="mt-0.5 block font-medium text-stone-800">
              {reservation.phone}
            </a>
          </div>
        </div>
      </div>

      {reservation.notes && (
        <div className="mt-5 rounded-xl border border-stone-100 bg-stone-50/60 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Guest notes</p>
          <p className="mt-1 text-sm leading-relaxed text-stone-700">{reservation.notes}</p>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-2 border-t border-stone-100 pt-5">
        {reservation.status === ReservationDbStatus.PENDING_REVIEW && (
          <>
            <Button
              size="sm"
              disabled={!!loading}
              onClick={async () => {
                setLoading("approve");
                setError(null);
                try {
                  const data = await approveHostReservation(reservation.id);
                  setCheckoutUrl(data.checkoutUrl);
                  if (data.reservation) onUpdated(data.reservation);
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Approval failed.");
                } finally {
                  setLoading(null);
                }
              }}
            >
              {loading === "approve" ? "Approving…" : "Approve & send payment"}
            </Button>
            <Button
              size="sm"
              variant="danger"
              disabled={!!loading}
              onClick={() =>
                runAction("reject", () =>
                  updateHostReservationStatus(reservation.id, ReservationDbStatus.REJECTED),
                )
              }
            >
              Reject
            </Button>
          </>
        )}

        {reservation.status === ReservationDbStatus.APPROVED_AWAITING_PAYMENT && (
          <>
            <Button
              size="sm"
              disabled={!!loading}
              onClick={() =>
                runAction("paid", () =>
                  updateHostReservationStatus(reservation.id, ReservationDbStatus.PAID_CONFIRMED),
                )
              }
            >
              Mark paid manually
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={!!loading}
              onClick={async () => {
                setLoading("checkout");
                setError(null);
                try {
                  const data = await createHostCheckoutSession(reservation.id);
                  setCheckoutUrl(data.checkoutUrl);
                  if (data.reservation) onUpdated(data.reservation);
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Checkout failed.");
                } finally {
                  setLoading(null);
                }
              }}
            >
              <CreditCard className="mr-1.5 h-3.5 w-3.5" />
              {loading === "checkout" ? "Creating…" : "Stripe checkout link"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={!!loading}
              onClick={copyPaymentLink}
            >
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              {copied ? "Copied" : "Copy payment link"}
            </Button>
            <Button
              size="sm"
              variant="danger"
              disabled={!!loading}
              onClick={() =>
                runAction("reject", () =>
                  updateHostReservationStatus(reservation.id, ReservationDbStatus.REJECTED),
                )
              }
            >
              Reject
            </Button>
          </>
        )}

        {(reservation.status === ReservationDbStatus.PENDING_REVIEW ||
          reservation.status === ReservationDbStatus.APPROVED_AWAITING_PAYMENT ||
          reservation.status === ReservationDbStatus.PAID_CONFIRMED) && (
          <Button
            size="sm"
            variant="ghost"
            disabled={!!loading}
            onClick={() =>
              runAction("cancel", () =>
                updateHostReservationStatus(reservation.id, ReservationDbStatus.CANCELLED),
              )
            }
          >
            Cancel
          </Button>
        )}

        {checkoutUrl && (
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-sage-700 underline-offset-2 hover:underline"
          >
            Open checkout ↗
          </a>
        )}
      </div>
    </article>
  );
}
