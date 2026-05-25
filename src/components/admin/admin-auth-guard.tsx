"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { adminCheckSession } from "@/lib/admin/api";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    adminCheckSession().then((ok) => {
      if (!ok) {
        const login = new URL("/admin/login", window.location.origin);
        login.searchParams.set("from", pathname);
        router.replace(login.pathname + login.search);
        return;
      }
      setReady(true);
    });
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-stone-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sage-200 border-t-sage-700" />
        <p className="text-sm text-stone-500">Opening command center…</p>
      </div>
    );
  }

  return <>{children}</>;
}
