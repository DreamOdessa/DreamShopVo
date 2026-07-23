begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

revoke all on function public.create_telegram_registration_challenge(
  bytea,
  bigint,
  bigint,
  text,
  timestamptz
) from public, anon, authenticated;
revoke all on function public.consume_telegram_registration_challenge(bytea)
  from public, anon, authenticated;

grant execute on function public.create_telegram_registration_challenge(
  bytea,
  bigint,
  bigint,
  text,
  timestamptz
) to service_role;
grant execute
  on function public.consume_telegram_registration_challenge(bytea)
  to service_role;

commit;
