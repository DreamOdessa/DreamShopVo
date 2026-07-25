create or replace function public.get_admin_order_summary(
  p_status public.order_status default null,
  p_search text default null,
  p_since timestamptz default null
)
returns table (
  order_count bigint,
  order_total numeric
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
    count(*),
    coalesce(
      sum(order_row.total) filter (
        where order_row.status <> 'cancelled'
      ),
      0
    )
  from public.orders as order_row
  where (p_status is null or order_row.status = p_status)
    and (p_since is null or order_row.created_at >= p_since)
    and (
      nullif(btrim(p_search), '') is null
      or order_row.customer_first_name ilike '%' || btrim(p_search) || '%'
      or order_row.customer_last_name ilike '%' || btrim(p_search) || '%'
      or order_row.delivery_city ilike '%' || btrim(p_search) || '%'
      or (
        length(regexp_replace(p_search, '\D', '', 'g')) >= 3
        and order_row.customer_phone ilike
          '%' || regexp_replace(p_search, '\D', '', 'g') || '%'
      )
      or (
        btrim(p_search) ~ '^[0-9]{1,12}$'
        and order_row.order_number = btrim(p_search)::bigint
      )
    );
end;
$$;

revoke all on function public.get_admin_order_summary(
  public.order_status,
  text,
  timestamptz
) from public;
revoke all on function public.get_admin_order_summary(
  public.order_status,
  text,
  timestamptz
) from anon;
revoke all on function public.get_admin_order_summary(
  public.order_status,
  text,
  timestamptz
) from authenticated;
grant execute on function public.get_admin_order_summary(
  public.order_status,
  text,
  timestamptz
) to authenticated;
