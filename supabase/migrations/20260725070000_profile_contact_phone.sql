begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

alter table public.profiles
  add column contact_phone text
  check (
    contact_phone is null
    or contact_phone ~ '^\+[0-9]{10,15}$'
  );

update public.profiles
set contact_phone = phone
where phone is not null;

grant update (contact_phone) on public.profiles to authenticated;

commit;
