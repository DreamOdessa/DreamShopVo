begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

create function public.enforce_order_creation_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));

  if (
    select count(*)
    from public.orders as recent_order
    where recent_order.user_id = new.user_id
      and recent_order.created_at >= now() - interval '10 minutes'
  ) >= 10 then
    raise exception using
      errcode = '54000',
      message = 'Too many orders were created recently';
  end if;

  return new;
end;
$$;

create trigger orders_rate_limit_creation
before insert on public.orders
for each row execute function public.enforce_order_creation_rate_limit();

revoke all on function public.enforce_order_creation_rate_limit() from public;

create function public.save_default_checkout_address(
  p_first_name text,
  p_last_name text,
  p_phone text,
  p_city text,
  p_delivery_method public.delivery_method,
  p_delivery_details text,
  p_establishment_name text,
  p_is_private_person boolean
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_address_id uuid;
begin
  if v_user_id is null then
    raise exception using
      errcode = '42501',
      message = 'Authentication is required';
  end if;

  if length(btrim(coalesce(p_first_name, ''))) not between 2 and 80
    or length(btrim(coalesce(p_last_name, ''))) not between 2 and 80
    or btrim(coalesce(p_phone, '')) !~ '^\+[0-9]{10,15}$'
    or length(btrim(coalesce(p_city, ''))) not between 2 and 120
    or p_delivery_method is null
    or length(btrim(coalesce(p_delivery_details, ''))) not between 2 and 500
    or length(btrim(coalesce(p_establishment_name, ''))) > 160
  then
    raise exception using
      errcode = '22023',
      message = 'Address details are invalid';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text, 1));

  update public.customer_addresses as address
  set
    first_name = btrim(p_first_name),
    last_name = btrim(p_last_name),
    phone = btrim(p_phone),
    city = btrim(p_city),
    delivery_method = p_delivery_method,
    delivery_details = btrim(p_delivery_details),
    establishment_name = nullif(btrim(coalesce(p_establishment_name, '')), ''),
    is_private_person = coalesce(p_is_private_person, true)
  where address.user_id = v_user_id
    and address.is_default
  returning address.id into v_address_id;

  if v_address_id is null then
    insert into public.customer_addresses (
      user_id, label, first_name, last_name, phone, city, delivery_method,
      delivery_details, establishment_name, is_private_person, is_default
    )
    values (
      v_user_id, 'Основна', btrim(p_first_name), btrim(p_last_name),
      btrim(p_phone), btrim(p_city), p_delivery_method,
      btrim(p_delivery_details),
      nullif(btrim(coalesce(p_establishment_name, '')), ''),
      coalesce(p_is_private_person, true), true
    )
    returning id into v_address_id;
  end if;

  return v_address_id;
end;
$$;

revoke all on function public.save_default_checkout_address(
  text, text, text, text, public.delivery_method, text, text, boolean
) from public, anon;

grant execute on function public.save_default_checkout_address(
  text, text, text, text, public.delivery_method, text, text, boolean
) to authenticated;

commit;
