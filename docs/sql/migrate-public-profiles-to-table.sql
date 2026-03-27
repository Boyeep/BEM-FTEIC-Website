-- Migrate the old public_profiles view into a real table with its own RLS.
-- Run this once on projects that already created public.public_profiles as a view.

do $$
declare
  public_profiles_kind "char";
begin
  select c.relkind
  into public_profiles_kind
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname = 'public_profiles'
    and c.relkind in ('v', 'm');

  if public_profiles_kind = 'v' then
    execute 'drop view public.public_profiles';
  elsif public_profiles_kind = 'm' then
    execute 'drop materialized view public.public_profiles';
  end if;
end
$$;

create table if not exists public.public_profiles (
  id uuid primary key references public.profiles (id) on delete cascade,
  username text not null,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.public_profiles enable row level security;

drop policy if exists "public_profiles_select_all" on public.public_profiles;

create policy "public_profiles_select_all" on public.public_profiles
for select to anon, authenticated using (true);

revoke all on table public.public_profiles from public;
revoke all on table public.public_profiles from anon, authenticated;
grant select on table public.public_profiles to anon, authenticated;

create or replace function public.sync_public_profile()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    delete from public.public_profiles
    where id = old.id;

    return old;
  end if;

  insert into public.public_profiles (id, username, avatar_url, updated_at)
  values (new.id, new.username, new.avatar_url, new.updated_at)
  on conflict (id) do update
  set username = excluded.username,
      avatar_url = excluded.avatar_url,
      updated_at = excluded.updated_at;

  return new;
end;
$$;

drop trigger if exists sync_public_profiles_on_profile_change on public.profiles;

create trigger sync_public_profiles_on_profile_change
after insert or update or delete on public.profiles
for each row
execute function public.sync_public_profile();

insert into public.public_profiles (id, username, avatar_url, updated_at)
select id, username, avatar_url, updated_at
from public.profiles
on conflict (id) do update
set username = excluded.username,
    avatar_url = excluded.avatar_url,
    updated_at = excluded.updated_at;

delete from public.public_profiles p
where not exists (
  select 1
  from public.profiles src
  where src.id = p.id
);
