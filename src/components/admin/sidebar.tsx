"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAccessToken } from "@/lib/auth/token";
import { useReservationStore } from "@/lib/store/reservation-store";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/reservations", label: "Reservations" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/payments", label: "Payments" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearReservationsCache } = useReservationStore();

  function logout() {
    clearAccessToken();
    clearReservationsCache();
    router.replace("/admin/login");
  }

  return (
    <aside className="flex w-56 flex-col border-r border-stone-200 bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400">Admin</p>
      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition",
              pathname === item.href ? "bg-sage-50 font-medium text-sage-800" : "text-stone-600 hover:bg-stone-50",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button type="button" onClick={logout} className="rounded-lg px-3 py-2 text-left text-sm text-stone-500 hover:bg-stone-50">
        Sign out
      </button>
    </aside>
  );
}
