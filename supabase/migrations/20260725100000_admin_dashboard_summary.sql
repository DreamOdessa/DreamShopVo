create or replace function public.get_admin_dashboard_summary()
returns table (
  pending_order_count bigint,
  processing_order_count bigint,
  orders_30d_count bigint,
  revenue_30d numeric,
  customer_count bigint,
  low_stock_count bigint,
  out_of_stock_count bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Administrator access required'
      using errcode = '42501';
  end if;

  return query
  select
    (select count(*) from public.orders where status = 'pending'),
    (select count(*) from public.orders where status = 'processing'),
    (
      select count(*)
      from public.orders
      where created_at >= now() - interval '30 days'
        and status <> 'cancelled'
    ),
    (
      select coalesce(sum(total), 0)
      from public.orders
      where created_at >= now() - interval '30 days'
        and status = 'delivered'
    ),
    (select count(*) from public.profiles where role <> 'admin'),
    (
      select count(*)
      from public.products
      where is_active
        and stock_quantity between 1 and 5
    ),
    (
      select count(*)
      from public.products
      where is_active
        and (stock_quantity = 0 or not in_stock)
    );
end;
$$;

revoke all on function public.get_admin_dashboard_summary() from public;
revoke all on function public.get_admin_dashboard_summary() from anon;
revoke all on function public.get_admin_dashboard_summary() from authenticated;
grant execute on function public.get_admin_dashboard_summary() to authenticated;
