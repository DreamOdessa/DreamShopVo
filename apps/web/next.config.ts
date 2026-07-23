import type { NextConfig } from "next";

const maintenanceHeaders = [
  {
    key: "Cache-Control",
    value: "no-store, max-age=0",
  },
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow, noarchive",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: maintenanceHeaders,
      },
    ];
  },
};

export default nextConfig;
