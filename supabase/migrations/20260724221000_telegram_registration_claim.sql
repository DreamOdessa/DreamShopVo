begin;

set local lock_timeout = '10s';
set local statement_timeout = '2min';

with ranked_challenges as (
  select
    id,
    row_number() over (
      partition by telegram_user_id
      order by created_at desc, id desc
    ) as position
  from public.telegram_registration_challenges
  where consumed_at is null
)
update public.telegram_registration_challenges
set consumed_at = now()
where id in (
  select id
  from ranked_challenges
  where position > 1
);

create unique index telegram_challenges_one_active_per_user_idx
  on public.telegram_registration_challenges (telegram_user_id)
  where consumed_at is null;

create function public.create_telegram_registration_challenge(
  p_token_hash bytea,
  p_telegram_user_id bigint,
  p_telegram_chat_id bigint,
  p_phone text,
  p_expires_at timestamptz
)
returns uuid
language sql
volatile
security definer
set search_path = ''
as $$
  insert into public.telegram_registration_challenges (
    token_hash,
    telegram_user_id,
    telegram_chat_id,
    phone,
    expires_at
  )
  values (
    p_token_hash,
    p_telegram_user_id,
    p_telegram_chat_id,
    p_phone,
    p_expires_at
  )
  on conflict (telegram_user_id) where consumed_at is null
  do update set
    token_hash = excluded.token_hash,
    telegram_chat_id = excluded.telegram_chat_id,
    phone = excluded.phone,
    expires_at = excluded.expires_at,
    created_at = now()
  returning telegram_registration_challenges.id;
$$;

create function public.consume_telegram_registration_challenge(
  p_token_hash bytea
)
returns table (
  challenge_id uuid,
  telegram_user_id bigint,
  telegram_chat_id bigint,
  phone text
)
language sql
volatile
security definer
set search_path = ''
as $$
  update public.telegram_registration_challenges
  set consumed_at = now()
  where token_hash = p_token_hash
    and consumed_at is null
    and expires_at > now()
  returning
    telegram_registration_challenges.id,
    telegram_registration_challenges.telegram_user_id,
    telegram_registration_challenges.telegram_chat_id,
    telegram_registration_challenges.phone;
$$;

revoke all on function public.create_telegram_registration_challenge(
  bytea,
  bigint,
  bigint,
  text,
  timestamptz
) from public;
revoke all on function public.consume_telegram_registration_challenge(bytea)
  from public;
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
