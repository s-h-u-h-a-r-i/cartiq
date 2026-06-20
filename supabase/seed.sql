insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
select
  '00000000-0000-0000-0000-000000000000'::uuid,
  seed_users.id,
  'authenticated',
  'authenticated',
  seed_users.email,
  extensions.crypt(seed_users.password, extensions.gen_salt('bf')),
  seed_users.created_at,
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object(
    'display_name', seed_users.display_name,
    'full_name', seed_users.display_name,
    'name', seed_users.display_name,
    'avatar_url', seed_users.avatar_url
  ),
  seed_users.created_at,
  seed_users.created_at
from (
  values
    (
      '11111111-1111-1111-1111-111111111111'::uuid,
      'mara.adeyemi@cartiq.local',
      'password',
      'Mara Adeyemi',
      'https://api.dicebear.com/9.x/initials/svg?seed=Mara%20Adeyemi',
      '2026-01-15 09:24:00+00'::timestamp with time zone
    ),
    (
      '22222222-2222-2222-2222-222222222222'::uuid,
      'theo.bennett@cartiq.local',
      'password',
      'Theo Bennett',
      'https://api.dicebear.com/9.x/initials/svg?seed=Theo%20Bennett',
      '2026-02-03 14:42:00+00'::timestamp with time zone
    ),
    (
      '33333333-3333-3333-3333-333333333333'::uuid,
      'lina.chen@cartiq.local',
      'password',
      'Lina Chen',
      'https://api.dicebear.com/9.x/initials/svg?seed=Lina%20Chen',
      '2026-03-21 18:07:00+00'::timestamp with time zone
    )
) as seed_users(id, email, password, display_name, avatar_url, created_at)
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
select
  seed_users.id,
  seed_users.id,
  seed_users.id::text,
  jsonb_build_object(
    'sub', seed_users.id::text,
    'email', seed_users.email,
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  seed_users.created_at,
  seed_users.created_at,
  seed_users.created_at
from (
  values
    (
      '11111111-1111-1111-1111-111111111111'::uuid,
      'mara.adeyemi@cartiq.local',
      'password',
      'Mara Adeyemi',
      'https://api.dicebear.com/9.x/initials/svg?seed=Mara%20Adeyemi',
      '2026-01-15 09:24:00+00'::timestamp with time zone
    ),
    (
      '22222222-2222-2222-2222-222222222222'::uuid,
      'theo.bennett@cartiq.local',
      'password',
      'Theo Bennett',
      'https://api.dicebear.com/9.x/initials/svg?seed=Theo%20Bennett',
      '2026-02-03 14:42:00+00'::timestamp with time zone
    ),
    (
      '33333333-3333-3333-3333-333333333333'::uuid,
      'lina.chen@cartiq.local',
      'password',
      'Lina Chen',
      'https://api.dicebear.com/9.x/initials/svg?seed=Lina%20Chen',
      '2026-03-21 18:07:00+00'::timestamp with time zone
    )
) as seed_users(id, email, password, display_name, avatar_url, created_at)
on conflict do nothing;

insert into public.profiles (
  id,
  display_name,
  avatar_url,
  created_at,
  updated_at
)
select
  seed_users.id,
  seed_users.display_name,
  seed_users.avatar_url,
  seed_users.created_at,
  seed_users.created_at
from (
  values
    (
      '11111111-1111-1111-1111-111111111111'::uuid,
      'mara.adeyemi@cartiq.local',
      'password',
      'Mara Adeyemi',
      'https://api.dicebear.com/9.x/initials/svg?seed=Mara%20Adeyemi',
      '2026-01-15 09:24:00+00'::timestamp with time zone
    ),
    (
      '22222222-2222-2222-2222-222222222222'::uuid,
      'theo.bennett@cartiq.local',
      'password',
      'Theo Bennett',
      'https://api.dicebear.com/9.x/initials/svg?seed=Theo%20Bennett',
      '2026-02-03 14:42:00+00'::timestamp with time zone
    ),
    (
      '33333333-3333-3333-3333-333333333333'::uuid,
      'lina.chen@cartiq.local',
      'password',
      'Lina Chen',
      'https://api.dicebear.com/9.x/initials/svg?seed=Lina%20Chen',
      '2026-03-21 18:07:00+00'::timestamp with time zone
    )
) as seed_users(id, email, password, display_name, avatar_url, created_at)
on conflict (id) do update
set
  display_name = excluded.display_name,
  avatar_url = excluded.avatar_url,
  updated_at = now();
