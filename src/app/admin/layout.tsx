"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith("/admin/login");

  if (isLogin) return <>{children}</>;

  return (
    <AdminAuthGuard>
      <div className="flex min-h-dvh bg-stone-50/80">
        <AdminSidebar />
        <div className="flex-1 overflow-auto p-6 md:p-10">{children}</div>
      </div>
    </AdminAuthGuard>
  );
}
