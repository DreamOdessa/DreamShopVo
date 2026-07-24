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

insert into auth.users (
  id,
  email,
  raw_app_meta_data,
  raw_user_meta_data
)
values (
  '00000000-0000-4000-8000-000000000002',
  'admin@example.test',
  '{"role":"admin"}',
  '{"first_name":"Admin"}'
);

insert into public.categories (id, name, slug, is_active)
values
  ('10000000-0000-4000-8000-000000000001', 'Active', 'active', true),
  ('10000000-0000-4000-8000-000000000002', 'Draft', 'draft', false);

insert into public.products (
  category_id,
  name,
  slug,
  price,
  is_active,
  stock_quantity
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'Visible',
    'visible',
    10,
    true,
    2
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'Hidden',
    'hidden',
    20,
    false,
    null
  );

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
  when has_column_privilege(
    current_user,
    'public.profiles',
    'contact_phone',
    'UPDATE'
  ) = true
    then 1
  else 0
end as customer_can_change_contact_phone;
do $$
begin
  begin
    perform public.set_customer_discount(
      '00000000-0000-4000-8000-000000000001',
      10
    );

    raise exception 'Customer changed a protected discount';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;
insert into public.wishlist_items (user_id, product_id)
values (
  '00000000-0000-4000-8000-000000000001',
  (select id from public.products where slug = 'visible')
);
select 1 / case
  when count(*) = 1 then 1
  else 0
end as customer_manages_own_wishlist
from public.wishlist_items;
delete from public.wishlist_items
where user_id = '00000000-0000-4000-8000-000000000001';
insert into public.customer_addresses (
  id,
  user_id,
  first_name,
  last_name,
  phone,
  city,
  delivery_method,
  delivery_details,
  is_default
)
values (
  '30000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  'Customer',
  'Example',
  '+380671234567',
  'Odesa',
  'post_office',
  'Відділення 1',
  true
);
update public.customer_addresses
set delivery_details = 'Відділення 2'
where id = '30000000-0000-4000-8000-000000000001';
select 1 / case
  when count(*) = 1 and min(delivery_details) = 'Відділення 2' then 1
  else 0
end as customer_manages_own_address
from public.customer_addresses;
delete from public.customer_addresses
where id = '30000000-0000-4000-8000-000000000001';
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
  null,
  '40000000-0000-4000-8000-000000000001'
);
select 1 / case
  when count(*) = 1 then 1
  else 0
end as repeated_checkout_returns_existing_order
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
  null,
  '40000000-0000-4000-8000-000000000001'
);
select 1 / case
  when count(*) = 1 and min(total) = 20 then 1
  else 0
end as customer_reads_own_order
from public.orders;
select 1 / case
  when stock_quantity = 0 then 1
  else 0
end as checkout_reserves_available_inventory
from public.products
where slug = 'visible';
do $$
begin
  begin
    perform *
    from public.create_order(
      jsonb_build_array(
        jsonb_build_object(
          'productId',
          (select id from public.products where slug = 'visible'),
          'quantity',
          1
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
      null,
      '40000000-0000-4000-8000-000000000003'
    );

    raise exception using
      errcode = 'XX000',
      message = 'Checkout accepted more inventory than available';
  exception
    when sqlstate 'P0001' then null;
  end;
end;
$$;
select 1 / case
  when count(*) = 1 and bool_and(status = 'cancelled') then 1
  else 0
end as customer_cancels_own_pending_order
from public.cancel_own_order(
  (
    select id
    from public.orders
    where checkout_token = '40000000-0000-4000-8000-000000000001'
  )
);
select 1 / case
  when stock_quantity = 2 then 1
  else 0
end as customer_cancellation_restores_inventory
from public.products
where slug = 'visible';
do $$
begin
  begin
    perform *
    from public.cancel_own_order(
      (
        select id
        from public.orders
        where checkout_token = '40000000-0000-4000-8000-000000000001'
      )
    );

    raise exception using
      errcode = 'XX000',
      message = 'Cancelled order was cancelled twice';
  exception
    when check_violation then null;
  end;
end;
$$;
do $$
begin
  begin
    perform *
    from public.create_order(
      jsonb_build_array(
        jsonb_build_object(
          'productId',
          (select id from public.products where slug = 'visible'),
          'quantity',
          1
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
      'card_online',
      false,
      null,
      '40000000-0000-4000-8000-000000000002'
    );

    raise exception 'Unavailable online payment method was accepted';
  exception
    when sqlstate '0A000' then null;
  end;
end;
$$;
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
  '20000000-0000-4000-8000-000000000002',
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

insert into public.order_items (
  order_id,
  product_id,
  product_name,
  unit_price,
  quantity
)
values (
  '20000000-0000-4000-8000-000000000002',
  (select id from public.products where slug = 'visible'),
  'Visible',
  10,
  1
);

begin;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000002';
set local request.jwt.claims = '{"app_metadata":{"role":"admin"}}';
set local role authenticated;
select 1 / case when public.is_admin() then 1 else 0 end as admin_is_admin;
select 1 / case
  when public.set_customer_discount(
    '00000000-0000-4000-8000-000000000001',
    12.5
  ) = 12.5 then 1
  else 0
end as admin_sets_customer_discount;
select 1 / case
  when discount_percent = 12.5 then 1
  else 0
end as customer_discount_is_persisted
from public.profiles
where id = '00000000-0000-4000-8000-000000000001';
select 1 / case when count(*) = 2 then 1 else 0 end
  as admin_sees_draft_products
from public.products;
update public.orders
set status = 'cancelled'
where id = '20000000-0000-4000-8000-000000000002';
select 1 / case
  when stock_quantity = 2 then 1
  else 0
end as cancellation_restores_reserved_inventory
from public.products
where slug = 'visible';
select 1 / case
  when inventory_reserved = false then 1
  else 0
end as cancellation_cannot_restore_inventory_twice
from public.orders
where id = '20000000-0000-4000-8000-000000000002';
update public.orders
set status = 'processing'
where id = '20000000-0000-4000-8000-000000000001';
update public.orders
set
  status = 'shipped',
  tracking_number = '20400000000000'
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
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
set local request.jwt.claims =
  '{"sub":"00000000-0000-4000-8000-000000000001","app_metadata":{"role":"customer"}}';
select 1 / case
  when count(*) = 4 then 1
  else 0
end as customer_reads_own_notifications
from public.notifications;
update public.notifications
set read_at = now();
select 1 / case
  when count(*) = 4 and bool_and(read_at is not null) then 1
  else 0
end as customer_marks_own_notifications_read
from public.notifications;
select 1 / case
  when has_column_privilege(
    current_user,
    'public.notifications',
    'title',
    'UPDATE'
  ) = false then 1
  else 0
end as customer_cannot_edit_notification_content;
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
      'public.create_order(jsonb,text,text,text,text,public.delivery_method,text,text,boolean,public.payment_method,boolean,text,uuid)',
      'EXECUTE'
    )
    and has_function_privilege(
      'authenticated',
      'public.create_order(jsonb,text,text,text,text,public.delivery_method,text,text,boolean,public.payment_method,boolean,text,uuid)',
      'EXECUTE'
    ) then 1
  else 0
end as only_authenticated_clients_can_create_orders;

select 1 / case
  when not has_function_privilege(
      'anon',
      'public.cancel_own_order(uuid)',
      'EXECUTE'
    )
    and has_function_privilege(
      'authenticated',
      'public.cancel_own_order(uuid)',
      'EXECUTE'
    ) then 1
  else 0
end as only_authenticated_clients_can_cancel_own_orders;

select 1 / case
  when to_regprocedure(
    'public.create_order(jsonb,text,text,text,text,public.delivery_method,text,text,boolean,public.payment_method,boolean,text)'
  ) is null then 1
  else 0
end as legacy_order_function_is_removed;

select 1 / case
  when not has_function_privilege(
      'anon',
      'public.reserve_order_item_inventory()',
      'EXECUTE'
    )
    and not has_function_privilege(
      'authenticated',
      'public.reserve_order_item_inventory()',
      'EXECUTE'
    )
    and not has_function_privilege(
      'anon',
      'public.restore_cancelled_order_inventory()',
      'EXECUTE'
    )
    and not has_function_privilege(
      'authenticated',
      'public.restore_cancelled_order_inventory()',
      'EXECUTE'
    )
    and not has_function_privilege(
      'anon',
      'public.enqueue_cancelled_order_event()',
      'EXECUTE'
    )
    and not has_function_privilege(
      'authenticated',
      'public.enqueue_cancelled_order_event()',
      'EXECUTE'
    ) then 1
  else 0
end as clients_cannot_call_inventory_triggers;

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
