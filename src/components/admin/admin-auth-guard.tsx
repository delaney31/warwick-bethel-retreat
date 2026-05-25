"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAccessToken } from "@/lib/auth/token";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      const login = new URL("/admin/login", window.location.origin);
      login.searchParams.set("from", pathname);
      router.replace(login.pathname + login.search);
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-stone-500">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
