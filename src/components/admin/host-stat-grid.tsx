"use client";

import { CalendarCheck, Clock, DollarSign, Inbox } from "lucide-react";
import { formatCurrency } from "@/lib/validation/booking";
import { cn } from "@/lib/utils/cn";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: typeof Inbox;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200/60 bg-gradient-to-br from-white to-stone-50/80 p-5 shadow-sm">
      <div
        className={cn(
          "absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-40 blur-2xl",
          accent,
        )}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
            {label}
          </p>
          <p className="mt-2 font-serif text-3xl font-light tracking-tight text-stone-900">
            {value}
          </p>
          {sub && <p className="mt-1 text-xs text-stone-500">{sub}</p>}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900/5 text-stone-600">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

export function HostStatGrid({
  pendingCount,
  awaitingCount,
  confirmedCount,
  totalCount,
  pipeline,
  booked,
}: {
  pendingCount: number;
  awaitingCount: number;
  confirmedCount: number;
  totalCount: number;
  pipeline: number;
  booked: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Pending review"
        value={String(pendingCount)}
        sub="Awaiting your decision"
        icon={Inbox}
        accent="bg-amber-200"
      />
      <StatCard
        label="Awaiting payment"
        value={String(awaitingCount)}
        sub={pipeline > 0 ? `${formatCurrency(pipeline)} in pipeline` : "Approved, not yet paid"}
        icon={Clock}
        accent="bg-sky-200"
      />
      <StatCard
        label="Confirmed stays"
        value={String(confirmedCount)}
        sub={booked > 0 ? `${formatCurrency(booked)} secured` : "Paid on calendar"}
        icon={CalendarCheck}
        accent="bg-sage-300"
      />
      <StatCard
        label="All requests"
        value={String(totalCount)}
        sub="Lifetime in database"
        icon={DollarSign}
        accent="bg-stone-300"
      />
    </div>
  );
}
