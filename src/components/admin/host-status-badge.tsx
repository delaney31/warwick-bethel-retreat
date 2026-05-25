import { ReservationDbStatus } from "@/lib/reservations/status";
import { HOST_STATUS_LABELS, HOST_STATUS_STYLES } from "@/lib/admin/status";
import { cn } from "@/lib/utils/cn";

export function HostStatusBadge({ status }: { status: ReservationDbStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]",
        HOST_STATUS_STYLES[status],
      )}
    >
      {HOST_STATUS_LABELS[status]}
    </span>
  );
}
