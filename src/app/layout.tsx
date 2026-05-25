import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { ReservationStoreProvider } from "@/lib/store/reservation-store";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Warwick Bethel Retreat — Luxury Nightly Stay Near Warwick Bethel",
    template: "%s | Warwick Bethel Retreat",
  },
  description:
    "A high-class nightly cottage retreat 15 minutes from Warwick Bethel. Personal host approval and secure payment.",
};

export const viewport: Viewport = { themeColor: "#2a241f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <ReservationStoreProvider>{children}</ReservationStoreProvider>
      </body>
    </html>
  );
}
