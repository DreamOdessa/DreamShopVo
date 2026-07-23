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
rollback;

begin;
set local request.jwt.claims = '{"app_metadata":{"role":"admin"}}';
set local role authenticated;
select 1 / case when public.is_admin() then 1 else 0 end as admin_is_admin;
select 1 / case when count(*) = 2 then 1 else 0 end
  as admin_sees_draft_products
from public.products;
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
