begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

create function public.cancel_own_order(p_order_id uuid)
returns table (
  order_id uuid,
  order_number bigint,
  status public.order_status
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_order_id uuid;
  v_order_number bigint;
  v_status public.order_status;
begin
  if v_user_id is null then
    raise exception using
      errcode = '42501',
      message = 'Authentication is required';
  end if;

  update public.orders as cancelled_order
  set status = 'cancelled'
  where cancelled_order.id = p_order_id
    and cancelled_order.user_id = v_user_id
    and cancelled_order.status = 'pending'
  returning
    cancelled_order.id,
    cancelled_order.order_number,
    cancelled_order.status
  into v_order_id, v_order_number, v_status;

  if v_order_id is null then
    if exists (
      select 1
      from public.orders as existing_order
      where existing_order.id = p_order_id
        and existing_order.user_id = v_user_id
    ) then
      raise exception using
        errcode = '23514',
        message = 'Order can no longer be cancelled';
    end if;

    raise exception using
      errcode = '42501',
      message = 'Order is unavailable';
  end if;

  return query
  select v_order_id, v_order_number, v_status;
end;
$$;

create function public.enqueue_cancelled_order_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'cancelled'
    and old.status is distinct from new.status
  then
    insert into public.integration_outbox (
      event_type,
      aggregate_id,
      payload
    )
    values (
      'order.cancelled',
      new.id,
      jsonb_build_object(
        'order_id', new.id,
        'order_number', new.order_number
      )
    );
  end if;

  return new;
end;
$$;

create trigger orders_enqueue_cancelled_event
after update of status on public.orders
for each row execute function public.enqueue_cancelled_order_event();

revoke all on function public.cancel_own_order(uuid) from public, anon;
grant execute on function public.cancel_own_order(uuid) to authenticated;

revoke all on function public.enqueue_cancelled_order_event() from public;

commit;
