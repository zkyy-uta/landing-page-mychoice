-- MyChoice — show every account from Authentication in the admin console
-- Run once in Supabase → SQL Editor when the Users page shows fewer people than
-- Authentication → Users (accounts created before the trigger existed have no
-- profile row, so the console cannot list them).
-- Nothing is deleted: missing rows are created, existing rows only get their
-- email refreshed.

insert into public.profiles (id, email, full_name)
select
  u.id,
  u.email,
  coalesce(nullif(u.raw_user_meta_data ->> 'full_name', ''), split_part(u.email, '@', 1))
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id
  and p.email is distinct from u.email;

-- Verification: profiles must now match the number of auth users.
select
  (select count(*) from auth.users) as auth_users,
  (select count(*) from public.profiles) as profiles,
  (select count(*) from auth.users u left join public.profiles p on p.id = u.id where p.id is null) as still_missing;
