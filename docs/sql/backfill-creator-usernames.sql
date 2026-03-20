-- Optional maintenance script:
-- Backfill blogs/events author text from profiles.username
-- Run this in Supabase SQL Editor if you want to replace old email-based
-- author values with usernames for existing records.

-- 1. Preview affected blog rows
select
  b.id,
  b.author as current_author,
  p.username as next_author
from public.blogs b
join public.profiles p on p.id = b.created_by
where b.author ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  and nullif(trim(p.username), '') is not null
  and b.author <> p.username
order by b.created_at desc;

-- 2. Preview affected event rows
select
  e.id,
  e.author as current_author,
  p.username as next_author
from public.events e
join public.profiles p on p.id = e.created_by
where e.author ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  and nullif(trim(p.username), '') is not null
  and e.author <> p.username
order by e.created_at desc;

-- 3. Apply the backfill
begin;

update public.blogs b
set
  author = p.username,
  updated_at = now()
from public.profiles p
where b.created_by = p.id
  and b.author ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  and nullif(trim(p.username), '') is not null
  and b.author <> p.username;

update public.events e
set
  author = p.username,
  updated_at = now()
from public.profiles p
where e.created_by = p.id
  and e.author ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  and nullif(trim(p.username), '') is not null
  and e.author <> p.username;

commit;
