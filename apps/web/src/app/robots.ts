import type { MetadataRoute } from "next";

import { getSiteUrl } from "../lib/env";
import { isStorefrontMaintenance } from "../lib/maintenance";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  if (isStorefrontMaintenance()) {
    return {
      host: siteUrl,
      rules: {
        disallow: "/",
        userAgent: "*",
      },
    };
  }

  return {
    host: siteUrl,
    rules: {
      allow: "/",
      disallow: [
        "/account",
        "/admin",
        "/auth",
        "/cart",
        "/checkout",
        "/orders",
        "/wishlist",
      ],
      userAgent: "*",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
