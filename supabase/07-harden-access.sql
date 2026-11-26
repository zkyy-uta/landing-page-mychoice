-- MyChoice — access policies for the renamed schema
-- Run this once in Supabase Dashboard → SQL Editor, on the project that holds
-- public.users, public.categories, public.subcategories, public.criteria and
-- public.catalog_options.
--
-- Context: the tables were renamed (pengguna → users, kategori → categories,
-- sub_kategori → subcategories, pilihan_katalog → catalog_options). Postgres
-- renames a table together with its policies, but NOT the SQL inside functions,
-- so public.is_admin() still pointed at the old public.profiles table. This
-- script rebuilds that helper on public.users and recreates the policies with
-- the new names.
--
-- Recommended dashboard settings:
--   Authentication → Sign In / Providers → Email: turn OFF "Allow new users to sign up"
--   Authentication → Sign In / Providers → Google: turn the provider OFF
-- The console login is admin-only; a non-admin account is signed out immediately.

-- ---------------------------------------------------------------------------
-- 1. Only the admin role can touch console data
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id_pengguna = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Guard against privilege escalation from the browser
--    (RLS already blocks it; this protects future policy mistakes. The SQL
--    Editor still works because auth.uid() is null there.)
-- ---------------------------------------------------------------------------
create or replace function public.guard_user_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only administrators can change a role';
  end if;

  if new.plan is distinct from old.plan and not public.is_admin() then
    raise exception 'Only administrators can change a plan';
  end if;

  if new.status_akun is distinct from old.status_akun and not public.is_admin() then
    raise exception 'Only administrators can change an account status';
  end if;

  return new;
end;
$$;

drop trigger if exists users_guard_privileges on public.users;
create trigger users_guard_privileges
  before update on public.users
  for each row execute function public.guard_user_privileges();

-- ---------------------------------------------------------------------------
-- 3. Row level security on every table the console reads
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.criteria enable row level security;
alter table public.catalog_options enable row level security;

-- users: an account can read its own row, admins read and edit everyone.
drop policy if exists "users read own or admin" on public.users;
create policy "users read own or admin"
  on public.users for select
  to authenticated
  using (id_pengguna = auth.uid() or public.is_admin());

drop policy if exists "users admin update" on public.users;
create policy "users admin update"
  on public.users for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Legacy policy name from the old `pengguna` table.
drop policy if exists "pengguna admin read" on public.users;

-- categories
drop policy if exists "categories public read" on public.categories;
create policy "categories public read"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- subcategories
drop policy if exists "subcategories public read" on public.subcategories;
create policy "subcategories public read"
  on public.subcategories for select
  to anon, authenticated
  using (true);

drop policy if exists "subcategories admin write" on public.subcategories;
create policy "subcategories admin write"
  on public.subcategories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- criteria
drop policy if exists "criteria public read" on public.criteria;
create policy "criteria public read"
  on public.criteria for select
  to anon, authenticated
  using (true);

drop policy if exists "criteria admin write" on public.criteria;
create policy "criteria admin write"
  on public.criteria for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- catalog_options
drop policy if exists "catalog_options public read" on public.catalog_options;
create policy "catalog_options public read"
  on public.catalog_options for select
  to anon, authenticated
  using (true);

drop policy if exists "catalog_options admin write" on public.catalog_options;
create policy "catalog_options admin write"
  on public.catalog_options for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Policies inherited from the old names are now redundant; drop them so only
-- the ones above decide access.
drop policy if exists "kategori public read" on public.categories;
drop policy if exists "kategori admin write" on public.categories;
drop policy if exists "sub_kategori public read" on public.subcategories;
drop policy if exists "sub_kategori admin write" on public.subcategories;
drop policy if exists "kriteria public read" on public.criteria;
drop policy if exists "kriteria admin write" on public.criteria;
drop policy if exists "pilihan_katalog public read" on public.catalog_options;
drop policy if exists "pilihan_katalog admin write" on public.catalog_options;

-- ---------------------------------------------------------------------------
-- 4. Table privileges: anonymous visitors only read the catalogue
-- ---------------------------------------------------------------------------
revoke insert, update, delete on all tables in schema public from anon;
revoke all on public.users from anon;
revoke all on public.admin_settings from anon;

grant usage on schema public to anon, authenticated;

grant select on public.categories, public.subcategories, public.criteria, public.catalog_options
  to anon, authenticated;
grant insert, update, delete on public.categories, public.subcategories, public.criteria, public.catalog_options
  to authenticated;

grant select, update on public.users to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Audit — who can open the console?
-- ---------------------------------------------------------------------------
select id_pengguna, email, nama, role, plan, status_akun, tanggal_dibuat
from public.users
order by tanggal_dibuat desc nulls last;

-- ---------------------------------------------------------------------------
-- 6. Remove an unwanted account (for example the leftover from the old Google
--    sign-in). Deleting the auth user also removes its public.users row when the
--    foreign key has "on delete cascade"; otherwise delete the users row first.
--
-- delete from auth.users where id = 'PASTE-UUID-HERE';
-- delete from public.users where id_pengguna = 'PASTE-UUID-HERE';
-- ---------------------------------------------------------------------------
