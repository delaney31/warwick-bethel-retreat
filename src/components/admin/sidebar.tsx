"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CalendarDays, LogOut } from "lucide-react";
import { adminLogout } from "@/lib/admin/api";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/admin", label: "Reservations", icon: LayoutDashboard },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await adminLogout();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-stone-200/80 bg-stone-900 text-stone-300 md:w-60 md:border-b-0 md:border-r">
      <div className="px-5 py-6 md:px-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500">Host</p>
        <p className="mt-2 font-serif text-lg font-light text-white">Warwick Bethel</p>
      </div>
      <nav className="flex gap-1 px-3 pb-3 md:flex-col md:px-3 md:pb-0">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm transition md:flex-none md:justify-start",
                active
                  ? "bg-white/10 font-medium text-white"
                  : "text-stone-400 hover:bg-white/5 hover:text-stone-200",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto hidden border-t border-white/10 p-4 md:block">
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-stone-400 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
      <div className="border-t border-white/10 p-3 md:hidden">
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center justify-center gap-2 py-2 text-sm text-stone-400"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
