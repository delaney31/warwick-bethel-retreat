import type { Metadata } from "next";
import { privateRouteMetadata } from "@/lib/content/site-metadata";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: privateRouteMetadata.robots,
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-stone-950 px-4">
      {children}
    </div>
  );
}
