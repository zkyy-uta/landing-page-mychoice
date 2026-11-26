-- MyChoice admin panel schema
-- Run this once in Supabase Dashboard → SQL Editor.
-- If public.profiles already exists from an older project, also run
-- supabase/02-fix-profiles.sql (it adds the missing columns without deleting data).
-- After that, create the admin login in Authentication → Users, then run the
-- "Grant admin role" snippet at the bottom of this file.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (mirrors auth.users with role / plan / status)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  plan text not null default 'basic' check (plan in ('basic', 'premium', 'pro')),
  status text not null default 'active' check (status in ('active', 'suspended', 'invited')),
  created_at timestamptz not null default now()
);

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
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin check used by every policy below.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Catalogue: criteria weights and candidate options
-- ---------------------------------------------------------------------------
create table if not exists public.criteria (
  id uuid primary key default gen_random_uuid(),
  domain text not null default 'laptop',
  name text not null,
  key text not null,
  description text,
  attribute_type text not null default 'benefit' check (attribute_type in ('benefit', 'cost')),
  unit text not null default '',
  weight numeric(5, 2) not null default 0 check (weight >= 0 and weight <= 1),
  scale_min numeric,
  scale_max numeric,
  community_votes integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (domain, key)
);

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  domain text not null default 'laptop',
  name text not null,
  brand text,
  description text,
  price numeric,
  specs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Reviews & feedback
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  author_name text not null,
  author_email text not null,
  rating smallint not null check (rating between 1 and 5),
  category text not null default 'General',
  model_text text,
  body text,
  criteria jsonb not null default '[]'::jsonb,
  status text not null default 'published' check (status in ('published', 'hidden')),
  resolved boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Admin console settings (single row)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_settings (
  id integer primary key default 1 check (id = 1),
  engine jsonb not null default '{
    "auto_normalize": true,
    "allow_custom_criteria": true,
    "normalization_method": "Linear Max-Min (Standard SAW)",
    "decimal_precision": "4 Decimal Places (0.0000)",
    "realtime_sync": true,
    "maintenance_mode": false,
    "require_2fa": false,
    "session_timeout": "12 hours",
    "cache_cleared_at": null
  }'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.admin_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.criteria enable row level security;
alter table public.candidates enable row level security;
alter table public.reviews enable row level security;
alter table public.admin_settings enable row level security;

drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "criteria public read" on public.criteria;
create policy "criteria public read" on public.criteria
  for select using (true);

drop policy if exists "criteria admin write" on public.criteria;
create policy "criteria admin write" on public.criteria
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "candidates public read" on public.candidates;
create policy "candidates public read" on public.candidates
  for select using (true);

drop policy if exists "candidates admin write" on public.candidates;
create policy "candidates admin write" on public.candidates
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews
  for select using (status = 'published' or public.is_admin());

drop policy if exists "reviews author insert" on public.reviews;
create policy "reviews author insert" on public.reviews
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "reviews admin write" on public.reviews;
create policy "reviews admin write" on public.reviews
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "settings admin only" on public.admin_settings;
create policy "settings admin only" on public.admin_settings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Table grants (RLS above still decides which rows are visible)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant select, usage on all sequences in schema public to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Starter catalogue (safe to re-run)
-- ---------------------------------------------------------------------------
insert into public.criteria (domain, name, key, description, attribute_type, unit, weight, scale_min, scale_max, sort_order)
values
  ('laptop', 'RAM Capacity', 'ram_gb', 'Higher memory gives higher multitasking headroom', 'benefit', 'GB', 0.25, 8, 64, 1),
  ('laptop', 'Storage (SSD / NVMe)', 'storage_gb', 'High-speed internal solid state drive space', 'benefit', 'GB', 0.20, 256, 2048, 2),
  ('laptop', 'Price / Procurement', 'price', 'Lower acquisition cost yields higher preference index', 'cost', 'IDR', 0.30, 5000000, 40000000, 3),
  ('laptop', 'Battery Life', 'battery_hours', 'Continuous standardized work test runtime', 'benefit', 'Hours', 0.15, 4, 20, 4),
  ('laptop', 'Screen Size', 'screen_inch', 'Diagonal visual display real-estate for productivity', 'benefit', 'Inches', 0.10, 11, 18, 5)
on conflict (domain, key) do nothing;

insert into public.candidates (domain, name, brand, description, price, specs)
select
  'laptop',
  'MSI Stealth 16 Studio A13V',
  'MSI',
  'Ultra-slim 16-inch creator & gaming powerhouse with vapor chamber cooling and magnesium-aluminum chassis.',
  32500000,
  '[{"criterion":"ram_gb","value":32,"unit":"GB"},{"criterion":"storage_gb","value":1000,"unit":"GB"},{"criterion":"price","value":32500000,"unit":"IDR"},{"criterion":"battery_hours","value":9.5,"unit":"Hours"},{"criterion":"screen_inch","value":16,"unit":"Inches"}]'::jsonb
where not exists (
  select 1 from public.candidates where name = 'MSI Stealth 16 Studio A13V' and domain = 'laptop'
);

-- ---------------------------------------------------------------------------
-- Grant admin role
-- Create the login in Authentication → Users first, then run:
--
--   update public.profiles set role = 'admin'
--   where email = 'admin@yourdomain.com';
--
-- (The trigger above creates the profile row automatically on sign-up.)
-- ---------------------------------------------------------------------------
