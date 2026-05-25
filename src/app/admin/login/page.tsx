import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<p className="text-center text-stone-500">Loading…</p>}>
      <AdminLoginForm />
    </Suspense>
  );
}
