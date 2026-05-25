import type { Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { ReservationStoreProvider } from "@/lib/store/reservation-store";
import { rootMetadata } from "@/lib/content/site-metadata";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

export const metadata = rootMetadata;

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
