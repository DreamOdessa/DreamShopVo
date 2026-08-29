begin;

create or replace function public.reject_unconfigured_order_payment_methods()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.payment_method not in (
    'cash_on_delivery'::public.payment_method,
    'card_on_delivery'::public.payment_method
  ) then
    raise exception using
      errcode = '0A000',
      message = 'Selected payment method is unavailable';
  end if;

  return new;
end;
$$;

revoke all on function public.reject_unconfigured_order_payment_methods() from public;

drop trigger if exists orders_reject_unconfigured_payment_methods on public.orders;
create trigger orders_reject_unconfigured_payment_methods
before insert or update of payment_method on public.orders
for each row
execute function public.reject_unconfigured_order_payment_methods();

commit;
