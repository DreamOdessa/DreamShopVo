begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

create function public.validate_order_status_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is not distinct from old.status then
    return new;
  end if;

  if not (
    (old.status = 'pending' and new.status in ('processing', 'cancelled'))
    or (
      old.status = 'processing'
      and new.status in ('shipped', 'cancelled')
    )
    or (
      old.status = 'shipped'
      and new.status in ('delivered', 'cancelled')
    )
  ) then
    raise exception using
      errcode = '23514',
      message = 'Invalid order status transition';
  end if;

  return new;
end;
$$;

create function public.notify_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status_label text;
begin
  if new.status is not distinct from old.status or new.user_id is null then
    return new;
  end if;

  v_status_label := case new.status
    when 'processing' then 'прийнято в роботу'
    when 'shipped' then 'відправлено'
    when 'delivered' then 'доставлено'
    when 'cancelled' then 'скасовано'
    else 'оновлено'
  end;

  insert into public.notifications (
    user_id,
    type,
    title,
    body,
    data,
    order_id
  )
  values (
    new.user_id,
    'order_status_update',
    'Статус замовлення змінено',
    format('Замовлення №%s %s.', new.order_number, v_status_label),
    jsonb_build_object(
      'order_id', new.id,
      'order_number', new.order_number,
      'status', new.status
    ),
    new.id
  );

  return new;
end;
$$;

create trigger orders_validate_status_transition
before update of status on public.orders
for each row execute function public.validate_order_status_transition();

create trigger orders_notify_status_change
after update of status on public.orders
for each row execute function public.notify_order_status_change();

revoke all on function public.validate_order_status_transition() from public;
revoke all on function public.notify_order_status_change() from public;

commit;
