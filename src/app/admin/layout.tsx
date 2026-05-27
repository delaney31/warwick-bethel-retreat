import type { Metadata } from "next";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { privateRouteMetadata } from "@/lib/content/site-metadata";

export const metadata: Metadata = {
  title: "Admin",
  robots: privateRouteMetadata.robots,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAppShell>{children}</AdminAppShell>;
}
