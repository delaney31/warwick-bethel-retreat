"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import {
  createAvailabilityBlock,
  deleteAvailabilityBlock,
  getVehicleAvailability,
  getVehicleBySlug,
  getApiErrorMessage,
} from "@/lib/api";
import { RETREAT_SLUG } from "@/lib/constants";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";

export default function AdminCalendarPage() {
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<{ id: string; start: string; end: string; reason: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const v = await getVehicleBySlug(RETREAT_SLUG);
    if (!v) return;
    setVehicleId(v.id);
    const data = await getVehicleAvailability(v.id);
    if (data) {
      setBlocks(
        data.blocks.map((b) => ({
          id: b.id,
          start: b.startDateUtc.slice(0, 10),
          end: b.endDateUtc.slice(0, 10),
          reason: b.reason,
        })),
      );
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!vehicleId) return;
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      await createAvailabilityBlock({
        vehicleId,
        startDateUtc: String(form.get("startDate")),
        endDateUtc: String(form.get("endDate")),
        reason: String(form.get("reason") || "Host block"),
        notes: String(form.get("notes") || ""),
      });
      e.currentTarget.reset();
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <div>
      <PageHeader title="Calendar" description="Manual blocks via Pacific Luxe API" />
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium">Block dates</h2>
          <FormField label="Start" name="startDate" type="date" required />
          <FormField label="End" name="endDate" type="date" required />
          <FormField label="Reason" name="reason" required />
          <FormField label="Notes" name="notes" as="textarea" rows={2} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit">Create block</Button>
        </form>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium">Active blocks</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {blocks.map((b) => (
              <li key={b.id} className="flex items-center justify-between border-b border-stone-50 py-2">
                <span>{b.start} – {b.end} · {b.reason}</span>
                <button type="button" className="text-xs text-red-600" onClick={() => deleteAvailabilityBlock(b.id).then(load)}>
                  Remove
                </button>
              </li>
            ))}
            {blocks.length === 0 && <li className="text-stone-500">No blocks</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
