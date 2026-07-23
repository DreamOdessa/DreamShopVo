begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

create type public.app_role as enum ('customer', 'tester', 'admin');
create type public.order_status as enum (
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);
create type public.delivery_method as enum (
  'post_office',
  'address',
  'schedule',
  'taxi'
);
create type public.payment_method as enum (
  'cash_on_delivery',
  'card_online',
  'card_on_delivery',
  'bank_transfer'
);
create type public.media_kind as enum ('main', 'hover', 'gallery', 'cover', 'showcase');
create type public.bug_status as enum ('new', 'in_progress', 'resolved', 'rejected');
create type public.notification_type as enum (
  'new_product',
  'new_order',
  'order_status_update',
  'promo',
  'system'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '',
  last_name text,
  email text,
  phone text,
  avatar_url text,
  discount_percent numeric(5, 2) not null default 0
    check (discount_percent between 0 and 100),
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null default 'Основна',
  first_name text not null,
  last_name text not null,
  phone text not null,
  city text not null,
  delivery_method public.delivery_method not null,
  delivery_details text not null,
  establishment_name text,
  is_private_person boolean not null default true,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index customer_addresses_one_default_per_user
  on public.customer_addresses (user_id)
  where is_default;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  parent_id uuid references public.categories (id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text not null default '',
  icon text not null default '',
  is_active boolean not null default true,
  show_in_showcase boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (parent_id is null or parent_id <> id)
);

create index categories_parent_sort_idx
  on public.categories (parent_id, sort_order, name);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  category_id uuid not null references public.categories (id) on delete restrict,
  subcategory_id uuid references public.categories (id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  original_price numeric(12, 2)
    check (original_price is null or original_price >= price),
  organic boolean not null default false,
  in_stock boolean not null default true,
  is_active boolean not null default true,
  is_popular boolean not null default false,
  weight text,
  ingredients text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (subcategory_id is null or subcategory_id <> category_id)
);

create index products_catalog_idx
  on public.products (is_active, category_id, subcategory_id, sort_order, created_at desc);
create index products_popular_idx
  on public.products (is_popular, sort_order)
  where is_active;

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  object_key text not null unique,
  kind public.media_kind not null,
  mime_type text not null
    check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')),
  alt_text text not null default '',
  sort_order smallint not null default 0 check (sort_order between 0 and 20),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  size_bytes bigint check (size_bytes is null or size_bytes > 0),
  created_at timestamptz not null default now()
);

create unique index product_media_one_main_idx
  on public.product_media (product_id)
  where kind = 'main';
create index product_media_product_sort_idx
  on public.product_media (product_id, sort_order);

create table public.category_media (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  object_key text not null unique,
  kind public.media_kind not null check (kind in ('cover', 'showcase')),
  mime_type text not null
    check (
      mime_type in (
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/avif',
        'video/mp4',
        'video/webm'
      )
    ),
  alt_text text not null default '',
  sort_order smallint not null default 0 check (sort_order between 0 and 20),
  created_at timestamptz not null default now()
);

create index category_media_category_sort_idx
  on public.category_media (category_id, sort_order);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated by default as identity unique,
  user_id uuid references auth.users (id) on delete set null,
  status public.order_status not null default 'pending',
  currency char(3) not null default 'UAH',
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  discount_amount numeric(12, 2) not null default 0 check (discount_amount >= 0),
  delivery_amount numeric(12, 2) not null default 0 check (delivery_amount >= 0),
  total numeric(12, 2) not null check (total >= 0),
  customer_first_name text not null,
  customer_last_name text not null,
  customer_phone text not null,
  delivery_city text not null,
  delivery_method public.delivery_method not null,
  delivery_details text not null,
  establishment_name text,
  is_private_person boolean not null default true,
  payment_method public.payment_method not null,
  contact_for_clarification boolean not null default false,
  customer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (total = subtotal - discount_amount + delivery_amount),
  check (discount_amount <= subtotal)
);

create index orders_user_created_idx
  on public.orders (user_id, created_at desc);
create index orders_status_created_idx
  on public.orders (status, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  product_slug text,
  product_image_object_key text,
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity between 1 and 99),
  line_total numeric(12, 2) generated always as (unit_price * quantity) stored
);

create index order_items_order_idx on public.order_items (order_id);

create table public.order_status_history (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  status public.order_status not null,
  changed_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index order_status_history_order_idx
  on public.order_status_history (order_id, created_at);

create table public.wishlist_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.product_views (
  product_id uuid not null references public.products (id) on delete cascade,
  view_date date not null default current_date,
  view_count bigint not null default 0 check (view_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (product_id, view_date)
);

create index product_views_ranking_idx
  on public.product_views (view_date desc, view_count desc);

create table public.site_settings (
  key text primary key check (length(key) between 1 and 100),
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text not null,
  data jsonb not null default '{}'::jsonb,
  order_id uuid references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_created_idx
  on public.notifications (user_id, created_at desc);
create index notifications_unread_idx
  on public.notifications (user_id, created_at desc)
  where read_at is null;

create table public.bug_reports (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  x_percent numeric(6, 3) not null check (x_percent between 0 and 100),
  y_percent numeric(6, 3) not null check (y_percent between 0 and 100),
  viewport_width integer not null check (viewport_width > 0),
  viewport_height integer not null check (viewport_height > 0),
  comment text not null check (length(comment) between 1 and 5000),
  status public.bug_status not null default 'new',
  user_id uuid not null references auth.users (id) on delete cascade,
  screenshot_object_key text,
  user_agent text,
  element_info jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bug_reports_status_created_idx
  on public.bug_reports (status, created_at desc);

create table public.telegram_registration_challenges (
  id uuid primary key default gen_random_uuid(),
  token_hash bytea not null unique,
  telegram_user_id bigint not null,
  telegram_chat_id bigint not null,
  phone text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index telegram_challenges_expiry_idx
  on public.telegram_registration_challenges (expires_at)
  where consumed_at is null;

create table public.integration_outbox (
  id bigint generated always as identity primary key,
  event_type text not null,
  aggregate_id uuid,
  payload jsonb not null default '{}'::jsonb,
  attempts smallint not null default 0 check (attempts >= 0),
  available_at timestamptz not null default now(),
  processed_at timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);

create index integration_outbox_pending_idx
  on public.integration_outbox (available_at, id)
  where processed_at is null;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
$$;

create function public.is_staff()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(
    auth.jwt() -> 'app_metadata' ->> 'role' in ('admin', 'tester'),
    false
  );
$$;

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role public.app_role;
begin
  requested_role := case
    when new.raw_app_meta_data ->> 'role' in ('customer', 'tester', 'admin')
      then (new.raw_app_meta_data ->> 'role')::public.app_role
    else 'customer'::public.app_role
  end;

  insert into public.profiles (
    id,
    first_name,
    last_name,
    email,
    phone,
    avatar_url,
    role
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'last_name',
    new.email,
    new.phone,
    new.raw_user_meta_data ->> 'avatar_url',
    requested_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create function public.sync_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  synced_role public.app_role;
begin
  synced_role := case
    when new.raw_app_meta_data ->> 'role' in ('customer', 'tester', 'admin')
      then (new.raw_app_meta_data ->> 'role')::public.app_role
    else 'customer'::public.app_role
  end;

  update public.profiles
  set
    email = new.email,
    phone = coalesce(new.phone, public.profiles.phone),
    avatar_url = coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      public.profiles.avatar_url
    ),
    role = synced_role
  where id = new.id;

  return new;
end;
$$;

create function public.protect_profile_privileges()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() is not null
    and not public.is_admin()
    and (
      new.role is distinct from old.role
      or new.discount_percent is distinct from old.discount_percent
    )
  then
    raise exception 'Only administrators can change role or discount';
  end if;

  return new;
end;
$$;

create function public.log_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.order_status_history (order_id, status, changed_by)
    values (new.id, new.status, auth.uid());
  end if;

  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger profiles_protect_privileges
before update on public.profiles
for each row execute function public.protect_profile_privileges();

create trigger customer_addresses_set_updated_at
before update on public.customer_addresses
for each row execute function public.set_updated_at();

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger orders_log_status
after insert or update of status on public.orders
for each row execute function public.log_order_status_change();

create trigger bug_reports_set_updated_at
before update on public.bug_reports
for each row execute function public.set_updated_at();

create trigger dreamshop_create_profile
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create trigger dreamshop_sync_profile
after update of email, phone, raw_app_meta_data, raw_user_meta_data on auth.users
for each row execute function public.sync_auth_user();

alter table public.profiles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.category_media enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.product_views enable row level security;
alter table public.site_settings enable row level security;
alter table public.notifications enable row level security;
alter table public.bug_reports enable row level security;
alter table public.telegram_registration_challenges enable row level security;
alter table public.integration_outbox enable row level security;

create policy profiles_select_own_or_admin
on public.profiles for select
to authenticated
using ((select auth.uid()) = id or (select public.is_admin()));

create policy profiles_update_own_or_admin
on public.profiles for update
to authenticated
using ((select auth.uid()) = id or (select public.is_admin()))
with check ((select auth.uid()) = id or (select public.is_admin()));

create policy addresses_owner_or_admin
on public.customer_addresses for all
to authenticated
using ((select auth.uid()) = user_id or (select public.is_admin()))
with check ((select auth.uid()) = user_id or (select public.is_admin()));

create policy categories_public_read
on public.categories for select
to anon, authenticated
using (is_active);

create policy categories_admin_write
on public.categories for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy products_public_read
on public.products for select
to anon, authenticated
using (is_active);

create policy products_admin_write
on public.products for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy product_media_public_read
on public.product_media for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_media.product_id
      and products.is_active
  )
);

create policy product_media_admin_write
on public.product_media for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy category_media_public_read
on public.category_media for select
to anon, authenticated
using (
  exists (
    select 1
    from public.categories
    where categories.id = category_media.category_id
      and categories.is_active
  )
);

create policy category_media_admin_write
on public.category_media for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy orders_select_own_or_admin
on public.orders for select
to authenticated
using ((select auth.uid()) = user_id or (select public.is_admin()));

create policy orders_admin_update
on public.orders for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy order_items_select_via_order
on public.order_items for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and (orders.user_id = (select auth.uid()) or (select public.is_admin()))
  )
);

create policy order_history_select_via_order
on public.order_status_history for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_status_history.order_id
      and (orders.user_id = (select auth.uid()) or (select public.is_admin()))
  )
);

create policy wishlist_owner
on public.wishlist_items for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy product_views_admin_read
on public.product_views for select
to authenticated
using ((select public.is_admin()));

create policy site_settings_public_read
on public.site_settings for select
to anon, authenticated
using (is_public);

create policy site_settings_admin_write
on public.site_settings for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy notifications_select_own
on public.notifications for select
to authenticated
using ((select auth.uid()) = user_id or (select public.is_admin()));

create policy notifications_update_own
on public.notifications for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy bug_reports_staff_insert
on public.bug_reports for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'new'
  and (select public.is_staff())
);

create policy bug_reports_staff_read
on public.bug_reports for select
to authenticated
using ((select public.is_staff()));

create policy bug_reports_admin_update
on public.bug_reports for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on function public.set_updated_at() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.is_staff() from public;
revoke all on function public.handle_new_auth_user() from public;
revoke all on function public.sync_auth_user() from public;
revoke all on function public.protect_profile_privileges() from public;
revoke all on function public.log_order_status_change() from public;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_staff() to authenticated;

grant select on public.categories, public.products, public.product_media,
  public.category_media, public.site_settings
to anon, authenticated;

grant select on public.profiles, public.customer_addresses, public.orders,
  public.order_items, public.order_status_history, public.wishlist_items,
  public.product_views, public.notifications, public.bug_reports
to authenticated;

grant update (
  first_name,
  last_name,
  phone,
  avatar_url
) on public.profiles to authenticated;

grant insert, update, delete on public.customer_addresses to authenticated;
grant insert, update, delete on public.categories to authenticated;
grant insert, update, delete on public.products to authenticated;
grant insert, update, delete on public.product_media to authenticated;
grant insert, update, delete on public.category_media to authenticated;
grant update (status) on public.orders to authenticated;
grant insert, delete on public.wishlist_items to authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant update (read_at) on public.notifications to authenticated;
grant insert on public.bug_reports to authenticated;
grant update (status) on public.bug_reports to authenticated;

insert into public.site_settings (key, value, is_public)
values ('home.hero', '{"subtitle": ""}'::jsonb, true);

commit;
