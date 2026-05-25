"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  Check,
  Copy,
  CreditCard,
  Mail,
  Phone,
  StickyNote,
  Users,
  XCircle,
  BedDouble,
} from "lucide-react";
import {
  approveHostReservation,
  createHostCheckoutSession,
  fetchHostPaymentLinks,
  updateHostReservationStatus,
  type HostReservation,
} from "@/lib/admin/api";
import { ReservationDbStatus } from "@/lib/reservations/status";
import { HostStatusBadge } from "@/components/admin/host-status-badge";
import { formatCurrency } from "@/lib/validation/booking";
import { Button } from "@/components/ui/button";

export function HostReservationCard({
  reservation,
  onUpdated,
}: {
  reservation: HostReservation;
  onUpdated: (r: HostReservation) => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stripeCheckoutUrl, setStripeCheckoutUrl] = useState<string | null>(null);
  const [guestPaymentUrl, setGuestPaymentUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<"guest" | "stripe" | null>(null);

  async function runAction(key: string, fn: () => Promise<HostReservation>) {
    setLoading(key);
    setError(null);
    try {
      const result = await fn();
      onUpdated(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setLoading(null);
    }
  }

  async function loadPaymentLinks() {
    const data = await fetchHostPaymentLinks(reservation.id);
    setGuestPaymentUrl(data.guestPaymentUrl);
    setStripeCheckoutUrl(data.stripeCheckoutUrl);
    return data;
  }

  async function copyPaymentLink(target: "guest" | "stripe" = "guest") {
    setLoading("copy");
    setError(null);
    try {
      const data = await loadPaymentLinks();
      const url =
        target === "stripe" && data.stripeCheckoutUrl
          ? data.stripeCheckoutUrl
          : data.guestPaymentUrl;
      await navigator.clipboard.writeText(url);
      setCopied(target);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not copy link.");
    } finally {
      setLoading(null);
    }
  }

  const createdLabel = format(parseISO(reservation.createdAt), "MMM d, yyyy · h:mm a");
  const checkInLabel = format(parseISO(reservation.checkIn), "EEE, MMM d, yyyy");
  const checkOutLabel = format(parseISO(reservation.checkOut), "EEE, MMM d, yyyy");
  const shortRef = reservation.id.slice(0, 8).toUpperCase();

  const canCancel =
    reservation.status === ReservationDbStatus.PENDING_REVIEW ||
    reservation.status === ReservationDbStatus.APPROVED_AWAITING_PAYMENT ||
    reservation.status === ReservationDbStatus.PAID_CONFIRMED;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-stone-200/70 bg-gradient-to-br from-white via-white to-stone-50/90 shadow-sm transition hover:border-stone-300/80 hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sage-400/0 via-sage-500/60 to-sage-400/0" />

      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <HostStatusBadge status={reservation.status} />
              <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
                Ref {shortRef}
              </span>
            </div>
            <h3 className="mt-3 font-serif text-2xl font-light tracking-tight text-stone-900 sm:text-[1.65rem]">
              {reservation.guestName}
            </h3>
            <p className="mt-1 text-xs text-stone-400">Submitted {createdLabel}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400">
              Stay total
            </p>
            <p className="mt-1 font-serif text-3xl font-light text-stone-900">
              {formatCurrency(reservation.totalAmount)}
            </p>
            <p className="mt-0.5 text-xs text-stone-500">
              {reservation.nights} night{reservation.nights !== 1 ? "s" : ""} · {reservation.guestCount}{" "}
              guest{reservation.guestCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Detail icon={Calendar} label="Check-in" value={checkInLabel} />
          <Detail icon={Calendar} label="Check-out" value={checkOutLabel} />
          <Detail icon={Users} label="Guests" value={String(reservation.guestCount)} />
          <Detail
            icon={BedDouble}
            label="Stay option"
            value={reservation.roomPackageLabel}
          />
          <Detail icon={Mail} label="Email" value={reservation.email} href={`mailto:${reservation.email}`} />
          <Detail icon={Phone} label="Phone" value={reservation.phone} href={`tel:${reservation.phone}`} />
          <Detail
            icon={StickyNote}
            label="Pricing"
            value={`${formatCurrency(reservation.baseRate)}/night base · ${formatCurrency(reservation.extraGuestFee)} extra guests`}
          />
        </div>

        {reservation.notes && (
          <div className="mt-5 rounded-xl border border-amber-100/80 bg-amber-50/40 px-4 py-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-800/70">
              Guest notes
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-700">{reservation.notes}</p>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
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
                    setStripeCheckoutUrl(data.checkoutUrl);
                    setGuestPaymentUrl(
                      `${window.location.origin}/reservations/${reservation.id}/payment`,
                    );
                    if (data.reservation) onUpdated(data.reservation);
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Approval failed.");
                  } finally {
                    setLoading(null);
                  }
                }}
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                {loading === "approve" ? "Approving…" : "Approve & create payment"}
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
                <XCircle className="mr-1.5 h-3.5 w-3.5" />
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
                <Check className="mr-1.5 h-3.5 w-3.5" />
                {loading === "paid" ? "Updating…" : "Mark paid manually"}
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
                    setStripeCheckoutUrl(data.checkoutUrl);
                    setGuestPaymentUrl(
                      `${window.location.origin}/reservations/${reservation.id}/payment`,
                    );
                    if (data.reservation) onUpdated(data.reservation);
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Could not create checkout link.");
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
                onClick={() => copyPaymentLink("guest")}
              >
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                {copied === "guest" ? "Copied!" : "Copy guest payment link"}
              </Button>
              {stripeCheckoutUrl && (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!!loading}
                  onClick={() => copyPaymentLink("stripe")}
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  {copied === "stripe" ? "Copied!" : "Copy Stripe link"}
                </Button>
              )}
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

          {canCancel && (
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
              Cancel reservation
            </Button>
          )}
        </div>

        {(guestPaymentUrl || stripeCheckoutUrl) && (
          <div className="mt-4 rounded-xl border border-sage-200/80 bg-sage-50/50 px-4 py-3 text-xs text-sage-900">
            <p className="font-semibold uppercase tracking-widest text-sage-700/80">
              Send to guest
            </p>
            {guestPaymentUrl && (
              <p className="mt-2 break-all">
                <span className="text-sage-600">Payment page: </span>
                <a
                  href={guestPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline-offset-2 hover:underline"
                >
                  {guestPaymentUrl}
                </a>
              </p>
            )}
            {stripeCheckoutUrl && (
              <p className="mt-2">
                <a
                  href={stripeCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sage-800 underline-offset-2 hover:underline"
                >
                  Open Stripe Checkout ↗
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" aria-hidden />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">{label}</p>
        {href ? (
          <a href={href} className="mt-0.5 block truncate font-medium text-sage-800 hover:underline">
            {value}
          </a>
        ) : (
          <p className="mt-0.5 font-medium leading-snug text-stone-800">{value}</p>
        )}
      </div>
    </div>
  );
}
