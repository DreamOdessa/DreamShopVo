begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

alter table public.orders
add column checkout_token uuid;

create unique index orders_user_checkout_token_idx
on public.orders (user_id, checkout_token)
where checkout_token is not null;

drop function public.create_order(
  jsonb,
  text,
  text,
  text,
  text,
  public.delivery_method,
  text,
  text,
  boolean,
  public.payment_method,
  boolean,
  text
);

create function public.create_order(
  p_items jsonb,
  p_customer_first_name text,
  p_customer_last_name text,
  p_customer_phone text,
  p_delivery_city text,
  p_delivery_method public.delivery_method,
  p_delivery_details text,
  p_establishment_name text,
  p_is_private_person boolean,
  p_payment_method public.payment_method,
  p_contact_for_clarification boolean,
  p_customer_note text,
  p_checkout_token uuid
)
returns table (
  order_id uuid,
  order_number bigint,
  total numeric
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_order_id uuid;
  v_order_number bigint;
  v_subtotal numeric(12, 2);
  v_discount_percent numeric(5, 2) := 0;
  v_discount_amount numeric(12, 2) := 0;
  v_total numeric(12, 2);
  v_item_count integer;
  v_product_count integer;
begin
  if v_user_id is null then
    raise exception using
      errcode = '42501',
      message = 'Authentication is required';
  end if;

  if p_checkout_token is null then
    raise exception using
      errcode = '22023',
      message = 'Checkout token is required';
  end if;

  if p_payment_method = 'card_online' then
    raise exception using
      errcode = '0A000',
      message = 'Online card payments are unavailable';
  end if;

  select
    existing_order.id,
    existing_order.order_number,
    existing_order.total
  into v_order_id, v_order_number, v_total
  from public.orders as existing_order
  where existing_order.user_id = v_user_id
    and existing_order.checkout_token = p_checkout_token;

  if v_order_id is not null then
    return query
    select v_order_id, v_order_number, v_total;
    return;
  end if;

  if jsonb_typeof(p_items) <> 'array' then
    raise exception using
      errcode = '22023',
      message = 'Order items are invalid';
  end if;

  if jsonb_array_length(p_items) not between 1 and 50 then
    raise exception using
      errcode = '22023',
      message = 'Order items are invalid';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_items) as item
    where jsonb_typeof(item) <> 'object'
      or coalesce(item ->> 'productId', '') !~
        '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$'
      or jsonb_typeof(item -> 'quantity') <> 'number'
      or coalesce(item ->> 'quantity', '') !~ '^[0-9]+$'
      or (item ->> 'quantity')::numeric not between 1 and 99
  ) then
    raise exception using
      errcode = '22023',
      message = 'Order items are invalid';
  end if;

  select count(*), count(distinct (item ->> 'productId')::uuid)
  into v_item_count, v_product_count
  from jsonb_array_elements(p_items) as item;

  if v_item_count <> v_product_count then
    raise exception using
      errcode = '22023',
      message = 'Duplicate products are not allowed';
  end if;

  if length(btrim(coalesce(p_customer_first_name, ''))) not between 2 and 80
    or length(btrim(coalesce(p_customer_last_name, ''))) not between 2 and 80
    or btrim(coalesce(p_customer_phone, '')) !~ '^\+[0-9]{10,15}$'
    or length(btrim(coalesce(p_delivery_city, ''))) not between 2 and 120
    or length(btrim(coalesce(p_delivery_details, ''))) not between 2 and 500
    or length(btrim(coalesce(p_establishment_name, ''))) > 160
    or length(btrim(coalesce(p_customer_note, ''))) > 1000
  then
    raise exception using
      errcode = '22023',
      message = 'Order details are invalid';
  end if;

  select
    coalesce(sum(product.price * requested.quantity), 0),
    count(*)
  into v_subtotal, v_product_count
  from (
    select
      (item ->> 'productId')::uuid as product_id,
      (item ->> 'quantity')::integer as quantity
    from jsonb_array_elements(p_items) as item
  ) as requested
  join public.products as product
    on product.id = requested.product_id
   and product.is_active
   and product.in_stock;

  if v_product_count <> v_item_count then
    raise exception using
      errcode = 'P0001',
      message = 'One or more products are unavailable';
  end if;

  select coalesce(profile.discount_percent, 0)
  into v_discount_percent
  from public.profiles as profile
  where profile.id = v_user_id;

  v_discount_percent := coalesce(v_discount_percent, 0);
  v_discount_amount := round(v_subtotal * v_discount_percent / 100, 2);
  v_total := v_subtotal - v_discount_amount;
  v_order_id := null;

  insert into public.orders as created_order (
    user_id,
    checkout_token,
    subtotal,
    discount_amount,
    delivery_amount,
    total,
    customer_first_name,
    customer_last_name,
    customer_phone,
    delivery_city,
    delivery_method,
    delivery_details,
    establishment_name,
    is_private_person,
    payment_method,
    contact_for_clarification,
    customer_note
  )
  values (
    v_user_id,
    p_checkout_token,
    v_subtotal,
    v_discount_amount,
    0,
    v_total,
    btrim(p_customer_first_name),
    btrim(p_customer_last_name),
    btrim(p_customer_phone),
    btrim(p_delivery_city),
    p_delivery_method,
    btrim(p_delivery_details),
    nullif(btrim(coalesce(p_establishment_name, '')), ''),
    coalesce(p_is_private_person, true),
    p_payment_method,
    coalesce(p_contact_for_clarification, false),
    nullif(btrim(coalesce(p_customer_note, '')), '')
  )
  on conflict (user_id, checkout_token)
    where checkout_token is not null
    do nothing
  returning
    created_order.id,
    created_order.order_number,
    created_order.total
  into v_order_id, v_order_number, v_total;

  if v_order_id is null then
    return query
    select
      existing_order.id,
      existing_order.order_number,
      existing_order.total
    from public.orders as existing_order
    where existing_order.user_id = v_user_id
      and existing_order.checkout_token = p_checkout_token;
    return;
  end if;

  insert into public.order_items (
    order_id,
    product_id,
    product_name,
    product_slug,
    product_image_object_key,
    unit_price,
    quantity
  )
  select
    v_order_id,
    product.id,
    product.name,
    product.slug,
    media.object_key,
    product.price,
    requested.quantity
  from (
    select
      (item ->> 'productId')::uuid as product_id,
      (item ->> 'quantity')::integer as quantity
    from jsonb_array_elements(p_items) as item
  ) as requested
  join public.products as product
    on product.id = requested.product_id
  left join lateral (
    select product_media.object_key
    from public.product_media
    where product_media.product_id = product.id
    order by
      case when product_media.kind = 'main' then 0 else 1 end,
      product_media.sort_order,
      product_media.id
    limit 1
  ) as media on true;

  insert into public.integration_outbox (
    event_type,
    aggregate_id,
    payload
  )
  values (
    'order.created',
    v_order_id,
    jsonb_build_object(
      'order_id', v_order_id,
      'order_number', v_order_number
    )
  );

  return query
  select v_order_id, v_order_number, v_total;
end;
$$;

revoke all on function public.create_order(
  jsonb,
  text,
  text,
  text,
  text,
  public.delivery_method,
  text,
  text,
  boolean,
  public.payment_method,
  boolean,
  text,
  uuid
) from public, anon;

grant execute on function public.create_order(
  jsonb,
  text,
  text,
  text,
  text,
  public.delivery_method,
  text,
  text,
  boolean,
  public.payment_method,
  boolean,
  text,
  uuid
) to authenticated;

commit;
