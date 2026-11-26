-- MyChoice — feedback moderation on public.decision_history_reviews
-- Run this once in Supabase Dashboard → SQL Editor.
--
-- Reviews live in public.decision_history_reviews (not in a `reviews` table).
-- The table already has: id, user_id, decision_history_id, rating, review,
-- created_at, updated_at. The admin console also needs the moderation columns
-- below, so this script adds them without touching existing rows.
--
-- Nothing is dropped and existing data is kept.

-- ---------------------------------------------------------------------------
-- 1. Columns used by the admin console
-- ---------------------------------------------------------------------------
alter table public.decision_history_reviews
  add column if not exists author_name text,
  add column if not exists author_email text,
  add column if not exists category text not null default 'General',
  add column if not exists model_text text,
  add column if not exists criteria jsonb not null default '[]'::jsonb,
  add column if not exists status text not null default 'published',
  add column if not exists resolved boolean not null default false,
  add column if not exists featured boolean not null default false;

-- Visibility must be published / hidden.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'decision_history_reviews_status_check'
  ) then
    alter table public.decision_history_reviews
      add constraint decision_history_reviews_status_check
      check (status in ('published', 'hidden'));
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Fill author details from public.users (reviewer names / emails)
-- ---------------------------------------------------------------------------
update public.decision_history_reviews r
set
  author_name = coalesce(nullif(r.author_name, ''), u.nama),
  author_email = coalesce(nullif(r.author_email, ''), u.email)
from public.users u
where u.id_pengguna = r.user_id
  and (r.author_name is null or r.author_email is null);

-- ---------------------------------------------------------------------------
-- 3. Access: only administrators read and moderate feedback
-- ---------------------------------------------------------------------------
alter table public.decision_history_reviews enable row level security;

grant select, update on public.decision_history_reviews to authenticated;

drop policy if exists "decision_history_reviews admin read" on public.decision_history_reviews;
create policy "decision_history_reviews admin read"
  on public.decision_history_reviews for select
  to authenticated
  using (public.is_admin());

drop policy if exists "decision_history_reviews admin update" on public.decision_history_reviews;
create policy "decision_history_reviews admin update"
  on public.decision_history_reviews for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. Verification
-- ---------------------------------------------------------------------------
select count(*) as total_reviews,
       count(*) filter (where status = 'hidden') as hidden,
       count(*) filter (where resolved) as resolved,
       count(*) filter (where featured) as featured
from public.decision_history_reviews;
