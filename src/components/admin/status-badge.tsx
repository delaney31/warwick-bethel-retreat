import { ReservationStatus, RESERVATION_STATUS_LABELS } from "@/types/reservation";
import { cn } from "@/lib/utils/cn";

const STYLES: Partial<Record<ReservationStatus, string>> = {
  [ReservationStatus.PendingReview]: "bg-amber-100 text-amber-900",
  [ReservationStatus.AwaitingPayment]: "bg-blue-100 text-blue-900",
  [ReservationStatus.Confirmed]: "bg-sage-100 text-sage-800",
  [ReservationStatus.Rejected]: "bg-red-100 text-red-800",
  [ReservationStatus.Cancelled]: "bg-stone-200 text-stone-600",
  [ReservationStatus.Completed]: "bg-stone-800 text-white",
};

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", STYLES[status] ?? "bg-stone-100 text-stone-700")}>
      {RESERVATION_STATUS_LABELS[status]}
    </span>
  );
}
