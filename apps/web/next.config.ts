import type { NextConfig } from "next";

import { getApiUrl, validateProductionEnv } from "./src/lib/env";

validateProductionEnv();

const apiUrl = new URL(getApiUrl());
const apiProtocol = apiUrl.protocol === "https:" ? "https" : "http";
const maintenanceEnabled = process.env.STOREFRONT_MAINTENANCE === "true";
const securityHeaders = [
  ...(maintenanceEnabled
    ? [
        {
          key: "Cache-Control",
          value: "no-store, max-age=0",
        },
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow, noarchive",
        },
      ]
    : []),
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Content-Security-Policy",
    value: "base-uri 'self'; frame-ancestors 'none'; object-src 'none'",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: apiUrl.hostname,
        pathname: "/media/**",
        port: apiUrl.port,
        protocol: apiProtocol,
      },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
