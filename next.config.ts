import path from "path";
import type { NextConfig } from "next";
import { CANONICAL_SITE_URL, LEGACY_REDIRECT_HOSTS } from "./src/lib/content/brand";

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
  async redirects() {
    const apex = CANONICAL_SITE_URL;
    const hostRedirects = LEGACY_REDIRECT_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `${apex}/:path*`,
      permanent: true,
    }));
    return hostRedirects;
  },
};

export default nextConfig;
