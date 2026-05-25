"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminLogin } from "@/lib/admin/api";
import { SITE_NAME } from "@/lib/content/brand";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      await adminLogin(String(form.get("password")));
      router.replace(searchParams.get("from") ?? "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-stone-100 via-stone-50 to-sage-50/30 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-stone-200/60 bg-white/90 shadow-2xl shadow-stone-900/5"
      >
        <div className="border-b border-stone-100 bg-stone-900 px-8 py-10 text-center text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-stone-400">
            Private host access
          </p>
          <h1 className="mt-3 font-serif text-3xl font-light">{SITE_NAME}</h1>
          <p className="mt-2 text-sm text-stone-400">Host command center</p>
        </div>
        <div className="space-y-5 px-8 py-8">
          <FormField
            label="Host password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <p className="text-xs text-stone-500">
            Secured with your private <code className="text-stone-600">ADMIN_PASSWORD</code> environment
            variable. Session lasts seven days on this device.
          </p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Entering…" : "Enter dashboard"}
          </Button>
        </div>
      </form>
    </div>
  );
}
