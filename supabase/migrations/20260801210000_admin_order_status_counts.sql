begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

create function public.get_admin_order_status_counts(
  p_search text default null,
  p_since timestamptz default null
)
returns table (
  status public.order_status,
  order_count bigint
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
    status_value.status,
    count(order_row.id)
  from unnest(enum_range(null::public.order_status)) as status_value(status)
  left join public.orders as order_row
    on order_row.status = status_value.status
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
    )
  group by status_value.status
  order by status_value.status;
end;
$$;

revoke all on function public.get_admin_order_status_counts(text, timestamptz)
from public, anon, authenticated;

grant execute on function public.get_admin_order_status_counts(text, timestamptz)
to authenticated;

commit;
