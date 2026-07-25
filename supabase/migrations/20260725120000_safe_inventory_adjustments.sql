create or replace function public.set_product_stock(
  p_product_id uuid,
  p_expected_stock integer,
  p_new_stock integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_id uuid;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Administrator access required'
      using errcode = '42501';
  end if;

  if p_new_stock is not null
    and (p_new_stock < 0 or p_new_stock > 1000000)
  then
    raise exception 'Invalid stock quantity'
      using errcode = '22003';
  end if;

  update public.products
  set
    stock_quantity = p_new_stock,
    in_stock = case
      when p_new_stock is null then in_stock
      else p_new_stock > 0
    end
  where id = p_product_id
    and stock_quantity is not distinct from p_expected_stock
  returning id into updated_id;

  return updated_id is not null;
end;
$$;

revoke all on function public.set_product_stock(uuid, integer, integer)
from public;
revoke all on function public.set_product_stock(uuid, integer, integer)
from anon;
revoke all on function public.set_product_stock(uuid, integer, integer)
from authenticated;
grant execute on function public.set_product_stock(uuid, integer, integer)
to authenticated;
