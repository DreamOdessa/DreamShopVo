begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

drop function public.claim_integration_events(text, integer);

create function public.claim_integration_events(
  p_event_type text,
  p_limit integer default 10
)
returns table (
  id bigint,
  aggregate_id uuid,
  attempts smallint
)
language sql
security definer
set search_path = ''
as $$
  with claimed as (
    select integration_outbox.id
    from public.integration_outbox
    where integration_outbox.processed_at is null
      and integration_outbox.event_type = p_event_type
      and integration_outbox.available_at <= now()
      and integration_outbox.attempts < 10
    order by integration_outbox.id
    for update skip locked
    limit greatest(1, least(coalesce(p_limit, 10), 25))
  )
  update public.integration_outbox as integration_outbox
  set
    attempts = integration_outbox.attempts + 1,
    available_at = now() + interval '15 minutes',
    last_error = null
  from claimed
  where integration_outbox.id = claimed.id
  returning
    integration_outbox.id,
    integration_outbox.aggregate_id,
    integration_outbox.attempts;
$$;

revoke all on function public.claim_integration_events(text, integer)
from public, anon, authenticated;

grant execute on function public.claim_integration_events(text, integer)
to service_role;

commit;
