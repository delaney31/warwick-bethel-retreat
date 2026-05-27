import type { Metadata } from "next";
import { privateRouteMetadata } from "@/lib/content/site-metadata";

export const metadata: Metadata = {
  title: "Reservation",
  robots: privateRouteMetadata.robots,
};

export default function ReservationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
