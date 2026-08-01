begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

create function public.get_admin_integration_summary()
returns table (
  pending_count bigint,
  retrying_count bigint,
  failed_count bigint,
  processed_24h_count bigint,
  oldest_pending_at timestamptz
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
    count(*) filter (
      where processed_at is null and attempts = 0
    ),
    count(*) filter (
      where processed_at is null and attempts between 1 and 9
    ),
    count(*) filter (
      where processed_at is null and attempts >= 10
    ),
    count(*) filter (
      where processed_at >= now() - interval '24 hours'
    ),
    min(created_at) filter (
      where processed_at is null and attempts < 10
    )
  from public.integration_outbox;
end;
$$;

create function public.get_admin_failed_integration_events(
  p_limit integer default 10
)
returns table (
  id bigint,
  event_type text,
  aggregate_id uuid,
  attempts smallint,
  last_error text,
  created_at timestamptz
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
    event.id,
    event.event_type,
    event.aggregate_id,
    event.attempts,
    event.last_error,
    event.created_at
  from public.integration_outbox as event
  where event.processed_at is null
    and event.attempts >= 10
  order by event.created_at desc, event.id desc
  limit greatest(1, least(coalesce(p_limit, 10), 50));
end;
$$;

create function public.retry_admin_integration_event(p_event_id bigint)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_updated_id bigint;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Administrator access required'
      using errcode = '42501';
  end if;

  update public.integration_outbox as event
  set
    attempts = 0,
    available_at = now(),
    last_error = null
  where event.id = p_event_id
    and event.processed_at is null
    and event.attempts >= 10
  returning event.id into v_updated_id;

  return v_updated_id is not null;
end;
$$;

revoke all on function public.get_admin_integration_summary()
from public, anon, authenticated;
revoke all on function public.get_admin_failed_integration_events(integer)
from public, anon, authenticated;
revoke all on function public.retry_admin_integration_event(bigint)
from public, anon, authenticated;

grant execute on function public.get_admin_integration_summary()
to authenticated;
grant execute on function public.get_admin_failed_integration_events(integer)
to authenticated;
grant execute on function public.retry_admin_integration_event(bigint)
to authenticated;

commit;
