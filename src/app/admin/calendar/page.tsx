"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import {
  createHostCalendarBlock,
  deleteHostCalendarBlock,
  fetchCalendarBlocks,
  type HostCalendarBlock,
} from "@/lib/admin/api";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";

function formatBlockDate(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminCalendarPage() {
  const [blocks, setBlocks] = useState<HostCalendarBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCalendarBlocks();
      setBlocks(data);
    } catch (err) {
      setBlocks([]);
      setError(err instanceof Error ? err.message : "Could not load calendar blocks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    const form = new FormData(formEl);
    const startDate = String(form.get("startDate") ?? "").trim();
    const endDate = String(form.get("endDate") ?? "").trim();
    const reason = String(form.get("reason") ?? "").trim();

    if (!startDate || !endDate || !reason) {
      setError("Start date, end date, and reason are required.");
      setSubmitting(false);
      return;
    }

    try {
      await createHostCalendarBlock({ startDate, endDate, reason });
      formEl.reset();
      setSuccess("Dates blocked — guests cannot book paid stays on this range.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create block.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onRemove(id: string) {
    setRemovingId(id);
    setError(null);
    setSuccess(null);
    try {
      await deleteHostCalendarBlock(id);
      setSuccess("Block removed.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove block.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Block dates on the Tuxedo Retreat calendar. Paid stays and host blocks prevent new confirmed bookings."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-sm font-medium text-stone-900">Block dates</h2>
          <p className="text-xs text-stone-500">
            Blocks appear on the public availability calendar. Pending requests are not
            auto-cancelled.
          </p>
          <FormField label="Start" name="startDate" type="date" required />
          <FormField label="End" name="endDate" type="date" required />
          <FormField
            label="Reason"
            name="reason"
            placeholder="e.g. Personal use, maintenance, Bethel event"
            required
          />
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-emerald-700" role="status">
              {success}
            </p>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Create block"}
          </Button>
        </form>

        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-900">Active blocks</h2>
          {loading ? (
            <p className="mt-4 text-sm text-stone-500">Loading…</p>
          ) : blocks.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">No manual blocks.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {blocks.map((b) => (
                <li
                  key={b.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-stone-100 bg-stone-50 px-3 py-2.5"
                >
                  <div className="min-w-0 text-sm">
                    <p className="font-medium text-stone-800">
                      {formatBlockDate(b.startDate)} – {formatBlockDate(b.endDate)}
                    </p>
                    <p className="text-stone-600">{b.reason}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void onRemove(b.id)}
                    disabled={removingId === b.id}
                    className="flex-shrink-0 text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {removingId === b.id ? "Removing…" : "Remove"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
