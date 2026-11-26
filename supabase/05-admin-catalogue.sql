-- MyChoice admin console — access for the real catalogue tables
-- Run this once in Supabase Dashboard → SQL Editor.
--
-- The console reads and writes these existing tables:
--   public.kategori, public.sub_kategori, public.kriteria, public.pilihan_katalog
-- and shows the public.pengguna directory next to the auth profiles.
-- The policies below keep the catalogue public-readable and let admins write to it.

-- Admin check (same helper as supabase/schema.sql).
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
-- 1. Catalogue tables: public read, admin-only writes
-- ---------------------------------------------------------------------------
alter table public.kategori enable row level security;
alter table public.sub_kategori enable row level security;
alter table public.kriteria enable row level security;
alter table public.pilihan_katalog enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.kategori, public.sub_kategori, public.kriteria, public.pilihan_katalog
  to anon, authenticated;
grant insert, update, delete on public.kategori, public.sub_kategori, public.kriteria, public.pilihan_katalog
  to authenticated;
grant usage, select on all sequences in schema public to authenticated;

drop policy if exists "kategori public read" on public.kategori;
create policy "kategori public read"
  on public.kategori for select
  to anon, authenticated
  using (true);

drop policy if exists "kategori admin write" on public.kategori;
create policy "kategori admin write"
  on public.kategori for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "sub_kategori public read" on public.sub_kategori;
create policy "sub_kategori public read"
  on public.sub_kategori for select
  to anon, authenticated
  using (true);

drop policy if exists "sub_kategori admin write" on public.sub_kategori;
create policy "sub_kategori admin write"
  on public.sub_kategori for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "kriteria public read" on public.kriteria;
create policy "kriteria public read"
  on public.kriteria for select
  to anon, authenticated
  using (true);

drop policy if exists "kriteria admin write" on public.kriteria;
create policy "kriteria admin write"
  on public.kriteria for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "pilihan_katalog public read" on public.pilihan_katalog;
create policy "pilihan_katalog public read"
  on public.pilihan_katalog for select
  to anon, authenticated
  using (true);

drop policy if exists "pilihan_katalog admin write" on public.pilihan_katalog;
create policy "pilihan_katalog admin write"
  on public.pilihan_katalog for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 2. pengguna: the admin console lists the whole directory (read-only there)
-- ---------------------------------------------------------------------------
alter table public.pengguna enable row level security;
grant select on public.pengguna to authenticated;

drop policy if exists "pengguna admin read" on public.pengguna;
create policy "pengguna admin read"
  on public.pengguna for select
  to authenticated
  using (public.is_admin());

-- Profiles stay editable by admins (role, plan, status).
grant select, update on public.profiles to authenticated;

drop policy if exists "profiles admin read" on public.profiles;
create policy "profiles admin read"
  on public.profiles for select
  to authenticated
  using (public.is_admin() or id = auth.uid());

drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 3. Verification — run this after the script to confirm the shape of the data
-- ---------------------------------------------------------------------------
select 'kategori' as tabel, count(*) as baris from public.kategori
union all
select 'sub_kategori', count(*) from public.sub_kategori
union all
select 'kriteria', count(*) from public.kriteria
union all
select 'pilihan_katalog', count(*) from public.pilihan_katalog;

select k.nama_kategori, count(distinct s.id_sub_kategori) as sub_kategori, count(p.id_pilihan_katalog) as pilihan
from public.kategori k
left join public.sub_kategori s on s.id_kategori = k.id_kategori
left join public.pilihan_katalog p on p.id_sub_kategori = s.id_sub_kategori
group by k.id_kategori, k.nama_kategori
order by k.id_kategori;
