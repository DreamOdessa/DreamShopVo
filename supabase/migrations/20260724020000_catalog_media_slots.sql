create unique index product_media_product_slot_unique_idx
  on public.product_media (product_id, sort_order)
  where sort_order between 0 and 2;

create unique index category_media_one_cover_idx
  on public.category_media (category_id)
  where kind = 'cover';
