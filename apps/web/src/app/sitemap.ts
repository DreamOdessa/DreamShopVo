import type { MetadataRoute } from "next";

import { getCatalogCategories, getCatalogProducts } from "../lib/catalog";
import { getSiteUrl } from "../lib/env";
import { isStorefrontMaintenance } from "../lib/maintenance";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isStorefrontMaintenance()) {
    return [];
  }

  const siteUrl = getSiteUrl();
  const [categories, products] = await Promise.all([
    getCatalogCategories(),
    getCatalogProducts(),
  ]);

  return [
    {
      changeFrequency: "daily",
      priority: 1,
      url: siteUrl,
    },
    {
      changeFrequency: "daily",
      priority: 0.9,
      url: `${siteUrl}/catalog`,
    },
    ...["about", "contacts", "delivery", "privacy", "returns", "terms"].map(
      (path) => ({
        changeFrequency: "monthly" as const,
        priority: 0.5,
        url: `${siteUrl}/${path}`,
      }),
    ),
    ...categories.map((category) => ({
      changeFrequency: "weekly" as const,
      priority: 0.8,
      url: `${siteUrl}/catalog/${category.slug}`,
    })),
    ...products.map((product) => ({
      changeFrequency: "weekly" as const,
      priority: 0.7,
      url: `${siteUrl}/product/${product.slug}`,
    })),
  ];
}
