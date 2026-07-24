\set ON_ERROR_STOP on

insert into auth.users (
  id,
  email,
  raw_app_meta_data,
  raw_user_meta_data
)
values (
  '00000000-0000-4000-8000-000000000001',
  'customer@example.test',
  '{"role":"customer"}',
  '{"first_name":"Customer"}'
);

insert into public.categories (id, name, slug, is_active)
values
  ('10000000-0000-4000-8000-000000000001', 'Active', 'active', true),
  ('10000000-0000-4000-8000-000000000002', 'Draft', 'draft', false);

insert into public.products (category_id, name, slug, price, is_active)
values
  ('10000000-0000-4000-8000-000000000001', 'Visible', 'visible', 10, true),
  ('10000000-0000-4000-8000-000000000002', 'Hidden', 'hidden', 20, false);

begin;
set local role anon;
select 1 / case when count(*) = 1 then 1 else 0 end
  as anon_sees_only_active_products
from public.products;
select 1 / case when count(*) = 1 then 1 else 0 end
  as anon_sees_only_active_categories
from public.categories;
rollback;

begin;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
set local request.jwt.claims =
  '{"sub":"00000000-0000-4000-8000-000000000001","app_metadata":{"role":"customer"}}';
set local role authenticated;
select 1 / case when count(*) = 1 then 1 else 0 end
  as customer_sees_own_profile
from public.profiles;
select 1 / case when public.is_admin() = false then 1 else 0 end
  as customer_is_not_admin;
select 1 / case
  when has_table_privilege(current_user, 'public.orders', 'INSERT') = false
    then 1
  else 0
end as customer_cannot_insert_orders;
select 1 / case
  when has_column_privilege(current_user, 'public.profiles', 'role', 'UPDATE') = false
    then 1
  else 0
end as customer_cannot_change_role;
select 1 / case
  when has_column_privilege(current_user, 'public.profiles', 'phone', 'UPDATE') = false
    then 1
  else 0
end as customer_cannot_change_verified_phone;
select 1 / case
  when count(*) = 1 then 1
  else 0
end as customer_creates_order_through_validated_function
from public.create_order(
  jsonb_build_array(
    jsonb_build_object(
      'productId',
      (select id from public.products where slug = 'visible'),
      'quantity',
      2
    )
  ),
  'Customer',
  'Example',
  '+380671234567',
  'Odesa',
  'post_office',
  'Відділення 1',
  null,
  true,
  'cash_on_delivery',
  false,
  null
);
select 1 / case
  when count(*) = 1 and min(total) = 20 then 1
  else 0
end as customer_reads_own_order
from public.orders;
rollback;

insert into public.orders (
  id,
  user_id,
  subtotal,
  total,
  customer_first_name,
  customer_last_name,
  customer_phone,
  delivery_city,
  delivery_method,
  delivery_details,
  payment_method
)
values (
  '20000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  10,
  10,
  'Customer',
  'Example',
  '+380671234567',
  'Odesa',
  'post_office',
  'Відділення 1',
  'cash_on_delivery'
);

begin;
set local request.jwt.claims = '{"app_metadata":{"role":"admin"}}';
set local role authenticated;
select 1 / case when public.is_admin() then 1 else 0 end as admin_is_admin;
select 1 / case when count(*) = 2 then 1 else 0 end
  as admin_sees_draft_products
from public.products;
update public.orders
set status = 'processing'
where id = '20000000-0000-4000-8000-000000000001';
update public.orders
set status = 'shipped'
where id = '20000000-0000-4000-8000-000000000001';
update public.orders
set status = 'delivered'
where id = '20000000-0000-4000-8000-000000000001';
select 1 / case
  when status = 'delivered' then 1
  else 0
end as admin_advances_order_through_valid_statuses
from public.orders
where id = '20000000-0000-4000-8000-000000000001';
select 1 / case
  when count(*) = 3 then 1
  else 0
end as status_changes_notify_customer
from public.notifications
where order_id = '20000000-0000-4000-8000-000000000001';
do $$
begin
  begin
    update public.orders
    set status = 'processing'
    where id = '20000000-0000-4000-8000-000000000001';

    raise exception 'Invalid terminal status transition was accepted';
  exception
    when check_violation then null;
  end;
end;
$$;
rollback;

select 1 / case
  when count(*) >= 16 and bool_and(relrowsecurity) then 1
  else 0
end
  as every_public_table_has_rls
from pg_class
where relnamespace = 'public'::regnamespace
  and relkind = 'r';

select 1 / case when count(*) = 0 then 1 else 0 end
  as service_tables_have_no_client_grants
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in (
    'telegram_registration_challenges',
    'integration_outbox'
  )
  and grantee in ('anon', 'authenticated');

select 1 / case
  when not has_function_privilege(
      'anon',
      'public.consume_telegram_registration_challenge(bytea)',
      'EXECUTE'
    )
    and not has_function_privilege(
      'authenticated',
      'public.consume_telegram_registration_challenge(bytea)',
      'EXECUTE'
    ) then 1
  else 0
end as clients_cannot_consume_telegram_challenges;

select 1 / case
  when not has_function_privilege(
      'anon',
      'public.create_telegram_registration_challenge(bytea,bigint,bigint,text,timestamp with time zone)',
      'EXECUTE'
    )
    and not has_function_privilege(
      'authenticated',
      'public.create_telegram_registration_challenge(bytea,bigint,bigint,text,timestamp with time zone)',
      'EXECUTE'
    ) then 1
  else 0
end as clients_cannot_create_telegram_challenges;

select 1 / case
  when not has_function_privilege(
      'anon',
      'public.create_order(jsonb,text,text,text,text,public.delivery_method,text,text,boolean,public.payment_method,boolean,text)',
      'EXECUTE'
    )
    and has_function_privilege(
      'authenticated',
      'public.create_order(jsonb,text,text,text,text,public.delivery_method,text,text,boolean,public.payment_method,boolean,text)',
      'EXECUTE'
    ) then 1
  else 0
end as only_authenticated_clients_can_create_orders;

select 1 / case
  when not has_function_privilege(
      'anon',
      'public.claim_integration_events(text,integer)',
      'EXECUTE'
    )
    and not has_function_privilege(
      'authenticated',
      'public.claim_integration_events(text,integer)',
      'EXECUTE'
    )
    and has_function_privilege(
      'service_role',
      'public.claim_integration_events(text,integer)',
      'EXECUTE'
    ) then 1
  else 0
end as only_service_role_can_claim_integration_events;

begin;
set local role service_role;
select public.create_telegram_registration_challenge(
  decode(repeat('ab', 32), 'hex'),
  123456789,
  123456789,
  '+380000000000',
  now() + interval '10 minutes'
);
select 1 / case when count(*) = 1 then 1 else 0 end
  as service_role_consumes_challenge_once
from public.consume_telegram_registration_challenge(
  decode(repeat('ab', 32), 'hex')
);
select 1 / case when count(*) = 0 then 1 else 0 end
  as consumed_challenge_cannot_be_reused
from public.consume_telegram_registration_challenge(
  decode(repeat('ab', 32), 'hex')
);
rollback;
