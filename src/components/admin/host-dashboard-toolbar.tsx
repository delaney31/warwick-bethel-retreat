"use client";

import { Search, RefreshCw, X } from "lucide-react";
import { ReservationDbStatus } from "@/lib/reservations/status";
import { HOST_STATUS_LABELS } from "@/lib/admin/status";
import { cn } from "@/lib/utils/cn";

const STATUS_FILTERS: Array<{ value: ReservationDbStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: ReservationDbStatus.PENDING_REVIEW, label: "Pending" },
  { value: ReservationDbStatus.APPROVED_AWAITING_PAYMENT, label: "Awaiting pay" },
  { value: ReservationDbStatus.PAID_CONFIRMED, label: "Confirmed" },
  { value: ReservationDbStatus.REJECTED, label: "Rejected" },
  { value: ReservationDbStatus.CANCELLED, label: "Cancelled" },
];

export function HostDashboardToolbar({
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  resultCount,
  totalCount,
  onRefresh,
  refreshing,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  statusFilter: ReservationDbStatus | "all";
  onStatusFilterChange: (v: ReservationDbStatus | "all") => void;
  resultCount: number;
  totalCount: number;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  return (
    <div className="rounded-2xl border border-stone-200/60 bg-white/90 p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search guest, email, phone, dates, or reference…"
            className="w-full rounded-xl border border-stone-200/80 bg-stone-50/50 py-2.5 pl-10 pr-10 text-sm text-stone-900 placeholder:text-stone-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200/60"
            aria-label="Search reservations"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200/80 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-sage-300 hover:text-sage-800 disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} aria-hidden />
          Refresh
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {STATUS_FILTERS.map(({ value, label }) => {
          const active = statusFilter === value;
          const fullLabel = value === "all" ? label : HOST_STATUS_LABELS[value as ReservationDbStatus];
          return (
            <button
              key={value}
              type="button"
              onClick={() => onStatusFilterChange(value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                active
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200/80",
              )}
              aria-pressed={active}
            >
              {fullLabel}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-stone-500">
        Showing <span className="font-medium text-stone-700">{resultCount}</span> of{" "}
        {totalCount} reservation{totalCount !== 1 ? "s" : ""}
        {query && (
          <>
            {" "}
            matching &ldquo;<span className="font-medium text-stone-700">{query}</span>&rdquo;
          </>
        )}
      </p>
    </div>
  );
}
