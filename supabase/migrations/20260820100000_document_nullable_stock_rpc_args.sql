-- PostgreSQL function arguments may be NULL even when their base type is not
-- nullable. Defaults make that public RPC contract explicit and let generated
-- Supabase types describe an omitted value as the same intentional NULL.
create or replace function public.set_product_stock(
  p_product_id uuid,
  p_expected_stock integer default null,
  p_new_stock integer default null
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
