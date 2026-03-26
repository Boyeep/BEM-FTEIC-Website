-- Signup/login whitelist

create table if not exists public.signup_whitelist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists signup_whitelist_email_unique
on public.signup_whitelist (lower(email));

alter table public.signup_whitelist enable row level security;

drop policy if exists "signup_whitelist_auth_read" on public.signup_whitelist;

create policy "signup_whitelist_auth_read" on public.signup_whitelist
for select to authenticated using (true);

drop policy if exists "signup_whitelist_auth_insert" on public.signup_whitelist;

create policy "signup_whitelist_auth_insert" on public.signup_whitelist
for insert to authenticated with check (auth.uid() = created_by);

drop policy if exists "signup_whitelist_auth_delete" on public.signup_whitelist;

create policy "signup_whitelist_auth_delete" on public.signup_whitelist
for delete to authenticated using (true);

create or replace function public.is_signup_email_whitelisted(candidate_email text)
returns boolean
language sql
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.signup_whitelist
    where lower(email) = lower(trim(candidate_email))
  );
$$;

grant execute on function public.is_signup_email_whitelisted(text)
to anon, authenticated;

insert into public.signup_whitelist (email)
values ('admin@example.com')
on conflict do nothing;
