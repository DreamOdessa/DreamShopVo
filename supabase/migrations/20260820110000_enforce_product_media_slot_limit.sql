-- The admin UI exposes exactly three product image slots (0, 1 and 2).
-- NOT VALID preserves any historical records while enforcing the launch limit
-- for every newly inserted or changed row.
alter table public.product_media
  add constraint product_media_launch_slot_limit
  check (sort_order between 0 and 2) not valid;
