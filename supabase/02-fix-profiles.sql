-- MyChoice — repair an existing public.profiles table
-- Run this once in Supabase → SQL Editor when public.profiles already existed
-- from an older project (it only had: id, full_name, role, created_at).
-- Nothing is dropped: missing columns are added and backfilled.

-- ---------------------------------------------------------------------------
-- 1. Missing columns
-- ---------------------------------------------------------------------------
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists plan text not null default 'basic';
alter table public.profiles add column if not exists status text not null default 'active';

-- ---------------------------------------------------------------------------
-- 2. Constraints (added only when the same name is not present yet)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_plan_check') then
    alter table public.profiles
      add constraint profiles_plan_check check (plan in ('basic', 'premium', 'pro'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_status_check') then
    alter table public.profiles
      add constraint profiles_status_check check (status in ('active', 'suspended', 'invited'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_role_check') then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('admin', 'user'));
  end if;
end $$;

create unique index if not exists profiles_email_key on public.profiles (email);

-- ---------------------------------------------------------------------------
-- 3. Foreign key to auth.users (skipped if orphan profile rows would block it)
-- ---------------------------------------------------------------------------
do $$
declare
  orphans integer;
begin
  if exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and contype = 'f'
      and confrelid = 'auth.users'::regclass
  ) then
    return;
  end if;

  select count(*) into orphans
  from public.profiles p
  left join auth.users u on u.id = p.id
  where u.id is null;

  if orphans > 0 then
    raise notice 'Skipping FK: % profile row(s) have no matching auth user', orphans;
    return;
  end if;

  alter table public.profiles
    add constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade;
end $$;

-- ---------------------------------------------------------------------------
-- 4. Trigger: never block sign-up, always keep the profile row in sync
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
    set email = coalesce(public.profiles.email, excluded.email);
  return new;
exception when others then
  -- A profile problem must not make "Add user" fail.
  raise warning 'handle_new_user failed for %: %', new.id, sqlerrm;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 5. Backfill email / full_name from auth.users
-- ---------------------------------------------------------------------------
update public.profiles p
set
  email = u.email,
  full_name = coalesce(nullif(p.full_name, ''), split_part(u.email, '@', 1))
from auth.users u
where u.id = p.id
  and (p.email is distinct from u.email or p.full_name is null);

-- ---------------------------------------------------------------------------
-- 6. RLS + grants (idempotent)
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant select, usage on all sequences in schema public to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 7. Verification — expect 9 columns and no NULL email left
-- ---------------------------------------------------------------------------
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'profiles'
order by ordinal_position;

select count(*) as profile_rows,
       count(*) filter (where email is null) as rows_without_email
from public.profiles;
