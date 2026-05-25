"use client";

import { useEffect, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { getVehicleAvailability, getVehicleBySlug } from "@/lib/api";
import { RETREAT_SLUG } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

type DayStatus = "available" | "booked" | "blocked";

export function AvailabilityCalendar() {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [dayStatus, setDayStatus] = useState<Map<string, DayStatus>>(new Map());
  const [loading, setLoading] = useState(true);
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  useEffect(() => {
    getVehicleBySlug(RETREAT_SLUG).then((v) => v && setVehicleId(v.id));
  }, []);

  useEffect(() => {
    if (!vehicleId) return;
    const from = format(startOfMonth(month), "yyyy-MM-dd");
    const to = format(endOfMonth(addMonths(month, 1)), "yyyy-MM-dd");
    setLoading(true);
    getVehicleAvailability(vehicleId, from, to)
      .then((data) => {
        if (!data) return;
        const map = new Map<string, DayStatus>();
        for (const range of data.blockedRanges) {
          let d = parseISO(range.start);
          const end = parseISO(range.end);
          while (d < end) {
            map.set(format(d, "yyyy-MM-dd"), "booked");
            d = new Date(d.getTime() + 86400000);
          }
        }
        for (const block of data.blocks) {
          let d = parseISO(block.startDateUtc.slice(0, 10));
          const end = parseISO(block.endDateUtc.slice(0, 10));
          while (d < end) {
            map.set(format(d, "yyyy-MM-dd"), "blocked");
            d = new Date(d.getTime() + 86400000);
          }
        }
        setDayStatus(map);
      })
      .finally(() => setLoading(false));
  }, [vehicleId, month]);

  const interval = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setMonth(subMonths(month, 1))} className="text-stone-500">←</button>
        <h3 className="text-lg font-light">{format(month, "MMMM yyyy")}</h3>
        <button type="button" onClick={() => setMonth(addMonths(month, 1))} className="text-stone-500">→</button>
      </div>
      <div className="mt-6 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-stone-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {Array.from({ length: interval[0].getDay() }).map((_, i) => <div key={`p${i}`} />)}
        {interval.map((date) => {
          const key = format(date, "yyyy-MM-dd");
          const status = dayStatus.get(key) ?? "available";
          return (
            <div
              key={key}
              className={cn(
                "flex h-9 items-center justify-center rounded-lg text-xs",
                !isSameMonth(date, month) && "opacity-30",
                status === "available" && "bg-white text-stone-700",
                status === "booked" && "bg-stone-800 text-white",
                status === "blocked" && "bg-stone-300 text-stone-600",
                loading && "animate-pulse",
              )}
            >
              {format(date, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
}
