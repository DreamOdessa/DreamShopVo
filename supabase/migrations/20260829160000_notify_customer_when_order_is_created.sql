begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

create function public.notify_order_created()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.user_id is null then
    return new;
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
    'new_order',
    'Замовлення прийнято',
    format(
      'Замовлення №%s успішно створено. Ми повідомимо про зміну статусу в особистому кабінеті.',
      new.order_number
    ),
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

create trigger orders_notify_creation
after insert on public.orders
for each row execute function public.notify_order_created();

revoke all on function public.notify_order_created() from public;

commit;
