begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

alter table public.products
add column stock_quantity integer
check (stock_quantity between 0 and 1000000);

alter table public.orders
add column inventory_reserved boolean not null default false;

create function public.reserve_order_item_inventory()
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

create function public.restore_cancelled_order_inventory()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'cancelled'
    and old.status <> 'cancelled'
    and old.inventory_reserved
  then
    update public.products as product
    set stock_quantity = product.stock_quantity + reserved.quantity
    from (
      select
        order_item.product_id,
        sum(order_item.quantity)::integer as quantity
      from public.order_items as order_item
      where order_item.order_id = new.id
        and order_item.product_id is not null
      group by order_item.product_id
    ) as reserved
    where product.id = reserved.product_id
      and product.stock_quantity is not null;

    update public.orders
    set inventory_reserved = false
    where id = new.id;
  end if;

  return new;
end;
$$;

create trigger order_items_reserve_inventory
before insert on public.order_items
for each row execute function public.reserve_order_item_inventory();

create trigger orders_restore_cancelled_inventory
after update of status on public.orders
for each row execute function public.restore_cancelled_order_inventory();

revoke all on function public.reserve_order_item_inventory() from public;
revoke all on function public.restore_cancelled_order_inventory() from public;

commit;
