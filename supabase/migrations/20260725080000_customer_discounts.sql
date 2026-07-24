begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

create function public.set_customer_discount(
  p_user_id uuid,
  p_discount_percent numeric
)
returns numeric
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_discount numeric(5, 2);
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception using
      errcode = '42501',
      message = 'Administrator access is required';
  end if;

  if p_user_id is null
    or p_discount_percent is null
    or p_discount_percent < 0
    or p_discount_percent > 100
  then
    raise exception using
      errcode = '22023',
      message = 'Discount must be between 0 and 100';
  end if;

  normalized_discount := round(p_discount_percent, 2);

  update public.profiles
  set discount_percent = normalized_discount
  where id = p_user_id
    and role <> 'admin';

  if not found then
    raise exception using
      errcode = 'P0002',
      message = 'Customer not found';
  end if;

  return normalized_discount;
end;
$$;

revoke all on function public.set_customer_discount(uuid, numeric)
  from public, anon, authenticated;
grant execute on function public.set_customer_discount(uuid, numeric)
  to authenticated;

commit;
