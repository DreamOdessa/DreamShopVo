# DreamShop catalog quality audit

Audit date: 2026-08-14  
Production: `https://dreamshop-next.vercel.app`

## Result

- Active storefront products: **186** across **8** catalog pages.
- Products with a visible primary image: **1**.
- Products using the image fallback: **185**.
- R2 objects under `products/`: **1**.
- Latest Vercel production deployment: `7f87737`, status `READY`.
- Vercel runtime errors during the last seven days: **0**.

The storefront count and the authenticated Cloudflare R2 inventory agree. The
missing product media is therefore the largest current visual and
catalog-quality problem, not an image-delivery failure. Copy and layout work
should continue, but product covers have the highest immediate customer impact.

## Safe cover rollout

1. Preview one missing cover:

   ```bash
   npm run covers:products -- --dry-run --limit=1
   ```

2. Review the generated WebP file under `.generated/product-covers`.
3. Apply an approved batch of no more than ten products:

   ```bash
   npm run covers:products -- --apply --limit=10 --keep-files
   ```

4. Review storefront cards and product pages before moving to the next batch:

   ```bash
   npm run covers:products -- --apply --offset=10 --limit=10 --keep-files
   ```

The generator now refuses an unbounded `--apply`. A full-catalog run requires
an explicit `--all` flag.

## Remaining data checks

After media is restored, audit descriptions, ingredients, weight and stock in
the admin catalog. Existing search, category, availability and sorting filters
can be used together and preserve their query parameters.
