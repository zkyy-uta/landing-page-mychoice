-- MyChoice — align the administrator accounts in public.users
-- Run this once in Supabase Dashboard → SQL Editor (the project with public.users).
--
-- Both accounts below are administrators:
--   pkm930027@gmail.com      → admin
--   nandaadrian10@gmail.com  → admin
-- Everyone else stays a regular user. Adhyca keeps the premium plan.

-- ---------------------------------------------------------------------------
-- 1. Promote the administrators (matched by email, with a name fallback)
-- ---------------------------------------------------------------------------
update public.users
set role = 'admin'
where lower(email) in ('pkm930027@gmail.com', 'nandaadrian10@gmail.com');

update public.users
set role = 'admin'
where lower(coalesce(nama, '')) in ('pkm930027', 'nandaadrian10');

-- ---------------------------------------------------------------------------
-- 2. Result — both rows must show role = admin
-- ---------------------------------------------------------------------------
select id_pengguna, email, nama, role, plan, status_akun, tanggal_dibuat
from public.users
order by role desc, email;

-- ---------------------------------------------------------------------------
-- 3. Reference (read only): status values and constraints on the table
--    The console writes status_akun as aktif / nonaktif / diundang.
--    If the constraint below expects different labels, tell me and I will adjust
--    the console mapping instead of changing your data.
-- ---------------------------------------------------------------------------
select distinct status_akun from public.users order by 1;

select conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid = 'public.users'::regclass
order by conname;
