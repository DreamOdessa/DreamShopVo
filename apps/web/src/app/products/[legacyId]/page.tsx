import { notFound, permanentRedirect } from "next/navigation";

import { getCatalogProductByLegacyId } from "../../../lib/catalog";

type LegacyProductPageProps = {
  params: Promise<{ legacyId: string }>;
};

export default async function LegacyProductPage({
  params,
}: LegacyProductPageProps) {
  const { legacyId } = await params;
  const product = await getCatalogProductByLegacyId(legacyId);

  if (!product) {
    notFound();
  }

  permanentRedirect(`/product/${product.slug}`);
}
