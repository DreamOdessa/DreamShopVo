import { updateTag } from "next/cache";

export const CATALOG_CACHE_TAG = "catalog";

export function refreshCatalogCache() {
  updateTag(CATALOG_CACHE_TAG);
}
