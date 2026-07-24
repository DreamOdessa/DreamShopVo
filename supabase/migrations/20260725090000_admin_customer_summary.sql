begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

create function public.get_admin_customer_summary(p_user_id uuid)
returns table (
  order_count bigint,
  delivered_order_count bigint,
  delivered_total numeric,
  discount_total numeric,
  last_order_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception using
      errcode = '42501',
      message = 'Administrator access is required';
  end if;

  if p_user_id is null then
    raise exception using
      errcode = '22023',
      message = 'Customer is required';
  end if;

  return query
  select
    count(order_row.id),
    count(order_row.id) filter (
      where order_row.status = 'delivered'
    ),
    coalesce(
      sum(order_row.total) filter (
        where order_row.status = 'delivered'
      ),
      0
    ),
    coalesce(
      sum(order_row.discount_amount) filter (
        where order_row.status = 'delivered'
      ),
      0
    ),
    max(order_row.created_at)
  from public.orders as order_row
  where order_row.user_id = p_user_id;
end;
$$;

revoke all on function public.get_admin_customer_summary(uuid)
  from public, anon, authenticated;
grant execute on function public.get_admin_customer_summary(uuid)
  to authenticated;

commit;
