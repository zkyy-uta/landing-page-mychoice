-- MyChoice admin console — correct account roles and plans
-- Run this once in Supabase Dashboard → SQL Editor.
--
-- 1. pkm930027@gmail.com  → admin
-- 2. naewibusononosino@gmail.com (Adhyca) → premium
--
-- The console reads the role from public.profiles.role and the plan from
-- public.profiles.plan, so both tables are aligned below.

-- ---------------------------------------------------------------------------
-- 1. Make sure every pengguna row that also exists in auth.users has a profile
-- ---------------------------------------------------------------------------
insert into public.profiles (id, email, full_name, role, plan, status)
select
  p.id_pengguna,
  p.email,
  p.nama,
  'user',
  'basic',
  'active'
from public.pengguna p
join auth.users u on u.id = p.id_pengguna
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Promote pkm to admin
-- ---------------------------------------------------------------------------
update public.profiles
set role = 'admin'
where lower(email) = 'pkm930027@gmail.com';

-- Fallback when the profile email is empty but the name matches.
update public.profiles
set role = 'admin'
where role <> 'admin'
  and lower(coalesce(full_name, '')) = 'pkm930027';

-- ---------------------------------------------------------------------------
-- 3. Move Adhyca to the premium plan (profiles + pengguna directory)
-- ---------------------------------------------------------------------------
update public.profiles
set plan = 'premium'
where lower(email) = 'naewibusononosino@gmail.com';

-- Fallback: match the display name when the email differs.
update public.profiles
set plan = 'premium'
where plan <> 'premium'
  and lower(coalesce(full_name, '')) = 'adhyca';

update public.pengguna
set jenis_langganan = 'premium'
where lower(email) = 'naewibusononosino@gmail.com'
   or lower(nama) = 'adhyca';

-- ---------------------------------------------------------------------------
-- 4. Verification — the result tells you whether pkm has an auth profile
-- ---------------------------------------------------------------------------
select 'profiles' as tabel, id::text as id, email, full_name, role, plan
from public.profiles
where lower(email) in ('pkm930027@gmail.com', 'naewibusononosino@gmail.com')
   or lower(coalesce(full_name, '')) in ('pkm930027', 'adhyca')
union all
select 'pengguna', id_pengguna::text, email, nama, '-', jenis_langganan
from public.pengguna
where lower(email) in ('pkm930027@gmail.com', 'naewibusononosino@gmail.com')
   or lower(nama) in ('pkm930027', 'adhyca');

-- If pkm does not appear in the "profiles" rows above, that email has no Supabase
-- Auth account yet, so it can be listed in the directory but cannot hold the
-- admin role. Sign that account up first, then re-run this script.
