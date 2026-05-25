"use client";

import {
  formatStayPackageRateLine,
  STAY_PACKAGE_OPTIONS,
  type StayPackageId,
} from "@/lib/pricing/stay-packages";
import { cn } from "@/lib/utils/cn";

export function StayPackageSelector({
  value,
  onChange,
  error,
}: {
  value: StayPackageId;
  onChange: (value: StayPackageId) => void;
  error?: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-stone-800">Stay option</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {STAY_PACKAGE_OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                "rounded-2xl border px-4 py-4 text-left transition",
                selected
                  ? "border-sage-500 bg-sage-50/80 shadow-sm ring-1 ring-sage-300/60"
                  : "border-stone-200/80 bg-white hover:border-stone-300",
              )}
            >
              <p className="font-medium text-stone-900">{option.label}</p>
              <p className="mt-1 text-xs text-stone-500">{option.description}</p>
              <p className="mt-2 text-sm text-sage-800">{formatStayPackageRateLine(option.id)}</p>
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
