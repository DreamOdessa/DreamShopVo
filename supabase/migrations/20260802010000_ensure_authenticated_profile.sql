create or replace function public.ensure_my_profile()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  insert into public.profiles (
    id,
    first_name,
    last_name,
    email,
    phone,
    avatar_url,
    role
  )
  select
    auth_user.id,
    coalesce(
      auth_user.raw_user_meta_data ->> 'first_name',
      auth_user.raw_user_meta_data ->> 'name',
      ''
    ),
    auth_user.raw_user_meta_data ->> 'last_name',
    auth_user.email,
    auth_user.phone,
    auth_user.raw_user_meta_data ->> 'avatar_url',
    case
      when auth_user.raw_app_meta_data ->> 'role' in ('customer', 'tester', 'admin')
        then (auth_user.raw_app_meta_data ->> 'role')::public.app_role
      else 'customer'::public.app_role
    end
  from auth.users as auth_user
  where auth_user.id = current_user_id
  on conflict (id) do nothing;
end;
$$;

revoke all on function public.ensure_my_profile() from public;
grant execute on function public.ensure_my_profile() to authenticated;
