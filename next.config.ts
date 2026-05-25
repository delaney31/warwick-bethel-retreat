import path from "path";
import type { NextConfig } from "next";
import { resolveBackendOriginForRewrites } from "./src/lib/api/resolve-api-url";

function isDeployedBuild(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async rewrites() {
    const origin = resolveBackendOriginForRewrites(process.env, isDeployedBuild());
    if (!origin) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${origin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
