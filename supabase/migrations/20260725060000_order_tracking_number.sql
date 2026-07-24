begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

alter table public.orders
add column tracking_number text
check (tracking_number is null or tracking_number ~ '^[0-9]{14}$');

create or replace function public.validate_order_status_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'shipped'
    and new.delivery_method = 'post_office'
    and new.tracking_number is null
  then
    raise exception using
      errcode = '23514',
      message = 'Tracking number is required before shipping';
  end if;

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

create or replace function public.notify_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_body text;
  v_status_label text;
  v_title text;
begin
  if new.user_id is null
    or (
      new.status is not distinct from old.status
      and new.tracking_number is not distinct from old.tracking_number
    )
  then
    return new;
  end if;

  if new.status is distinct from old.status then
    v_status_label := case new.status
      when 'processing' then 'прийнято в роботу'
      when 'shipped' then 'відправлено'
      when 'delivered' then 'доставлено'
      when 'cancelled' then 'скасовано'
      else 'оновлено'
    end;
    v_title := 'Статус замовлення змінено';
    v_body := format(
      'Замовлення №%s %s.%s',
      new.order_number,
      v_status_label,
      case
        when new.status = 'shipped' and new.tracking_number is not null
          then format(' ТТН: %s.', new.tracking_number)
        else ''
      end
    );
  else
    v_title := 'ТТН замовлення оновлено';
    v_body := format(
      'Для замовлення №%s оновлено ТТН: %s.',
      new.order_number,
      new.tracking_number
    );
  end if;

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
    v_title,
    v_body,
    jsonb_strip_nulls(
      jsonb_build_object(
        'order_id', new.id,
        'order_number', new.order_number,
        'status', new.status,
        'tracking_number', new.tracking_number
      )
    ),
    new.id
  );

  return new;
end;
$$;

drop trigger orders_notify_status_change on public.orders;

create trigger orders_notify_status_change
after update of status, tracking_number on public.orders
for each row execute function public.notify_order_status_change();

grant update (tracking_number) on public.orders to authenticated;

commit;
