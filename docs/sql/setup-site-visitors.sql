-- Visitor analytics table

create table if not exists public.site_visitors (
  id text primary key,
  last_seen_at timestamptz not null default now(),
  last_path text,
  user_agent text
);

alter table public.site_visitors enable row level security;

create policy "site_visitors_public_insert"
on public.site_visitors
for insert
to public
with check (true);

create policy "site_visitors_public_update"
on public.site_visitors
for update
to public
using (true)
with check (true);

create policy "site_visitors_public_read_count"
on public.site_visitors
for select
to public
using (true);
