"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

export function AdminAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith("/admin/login");

  if (isLogin) return <>{children}</>;

  return (
    <AdminAuthGuard>
      <div className="flex min-h-dvh flex-col bg-gradient-to-br from-stone-100 via-stone-50 to-sage-50/20 md:flex-row">
        <AdminSidebar />
        <main className="flex-1 overflow-auto px-4 py-8 md:px-10 md:py-12">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}
