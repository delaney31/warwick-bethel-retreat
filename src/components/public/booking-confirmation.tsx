import Link from "next/link";
import { format, parseISO } from "date-fns";
import { CheckCircle2 } from "lucide-react";
import type { BookingSubmitSuccess } from "@/lib/api/booking-public";
import { formatCurrency } from "@/lib/validation/booking";
import { Button } from "@/components/ui/button";

function formatDateLabel(iso: string) {
  try {
    return format(parseISO(iso), "MMMM d, yyyy");
  } catch {
    return iso;
  }
}

export function BookingConfirmation({ success }: { success: BookingSubmitSuccess }) {
  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-stone-200/60 bg-white shadow-2xl shadow-stone-900/5">
      <div className="bg-gradient-to-br from-sage-800 to-stone-900 px-8 py-12 text-center text-white">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
          <CheckCircle2 className="h-8 w-8 text-amber-300" strokeWidth={1.5} />
        </div>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400/90">
          Request received
        </p>
        <h2 className="mt-3 font-serif text-3xl font-light">Thank you, {success.guestName}</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70">
          We&apos;ll review your stay and send payment instructions if approved. You will not be
          charged until the host approves your dates and you complete secure checkout.
        </p>
      </div>

      <div className="space-y-6 px-8 py-8">
        <div className="rounded-2xl border border-stone-100 bg-stone-50/80 p-6">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                Check-in
              </dt>
              <dd className="mt-1 font-medium text-stone-900">{formatDateLabel(success.checkIn)}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                Check-out
              </dt>
              <dd className="mt-1 font-medium text-stone-900">{formatDateLabel(success.checkOut)}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                Length of stay
              </dt>
              <dd className="mt-1 font-medium text-stone-900">
                {success.nights} night{success.nights !== 1 ? "s" : ""}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                Estimated total
              </dt>
              <dd className="mt-1 font-serif text-xl font-light text-stone-900">
                {formatCurrency(success.subtotal)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 font-mono text-[11px] text-stone-400">
            Reference {success.id}
          </p>
        </div>

        <p className="text-center text-sm text-stone-500">
          Questions? Reply to your confirmation email or{" "}
          <Link href="/contact" className="text-sage-700 underline-offset-2 hover:underline">
            contact your host
          </Link>
          .
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/" variant="primary">
            Return home
          </Button>
          <Button href="/availability" variant="secondary">
            View calendar
          </Button>
        </div>
      </div>
    </div>
  );
}
