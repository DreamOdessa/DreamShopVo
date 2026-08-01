begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

create or replace function public.reserve_order_item_inventory()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_product_id uuid;
begin
  if new.product_id is null then
    raise exception using
      errcode = 'P0001',
      message = 'One or more products are unavailable';
  end if;

  update public.products as product
  set stock_quantity = case
    when product.stock_quantity is null then null
    else product.stock_quantity - new.quantity
  end
  where product.id = new.product_id
    and product.is_active
    and product.in_stock
    and exists (
      select 1
      from public.categories as category
      where category.id = product.category_id
        and category.is_active
    )
    and (
      product.stock_quantity is null
      or product.stock_quantity >= new.quantity
    )
  returning product.id into v_product_id;

  if v_product_id is null then
    raise exception using
      errcode = 'P0001',
      message = 'One or more products are unavailable';
  end if;

  update public.orders
  set inventory_reserved = true
  where id = new.order_id;

  return new;
end;
$$;

revoke all on function public.reserve_order_item_inventory() from public;

commit;
