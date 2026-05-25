import path from "path";
import type { NextConfig } from "next";

/**
 * Booking, Stripe webhooks, and host admin APIs are implemented in `src/app/api/*`.
 * Do NOT add a catch-all `/api/:path*` rewrite to an external backend — it breaks
 * `/api/booking` in production (requests would hit Render instead of Next.js).
 */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
