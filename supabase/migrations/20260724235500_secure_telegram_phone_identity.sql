begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

create unique index profiles_phone_unique_idx
  on public.profiles (phone)
  where phone is not null;

revoke update (phone) on public.profiles from authenticated;

commit;
