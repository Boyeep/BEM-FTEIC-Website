-- Events table

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  author text not null,
  category text not null,
  cover_image text not null,
  event_date date not null,
  status text not null default 'ONGOING',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "events_public_read" on public.events
for select to public using (true);

create policy "events_auth_insert" on public.events
for insert to authenticated with check (auth.uid() = created_by);

create policy "events_auth_update" on public.events
for update to authenticated using (auth.uid() = created_by) with check (auth.uid() = created_by);
