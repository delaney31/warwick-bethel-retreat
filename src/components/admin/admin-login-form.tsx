"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAdmin } from "@/lib/auth/admin-auth";
import { useReservationStore } from "@/lib/store/reservation-store";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshReservationsFromApi } = useReservationStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      await loginAdmin(String(form.get("email")), String(form.get("password")));
      await refreshReservationsFromApi();
      router.replace(searchParams.get("from") ?? "/admin");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel mx-auto max-w-md space-y-5 rounded-2xl p-8 shadow-xl">
      <h1 className="text-center text-2xl font-light text-stone-900">Admin Sign In</h1>
      <p className="text-center text-xs text-stone-500">Pacific Luxe API · Retreat database</p>
      <FormField label="Email" name="email" type="email" defaultValue="admin@warwickbethelretreat.com" required />
      <FormField label="Password" name="password" type="password" required />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
