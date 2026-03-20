-- Galeri table

create table if not exists public.galeri (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  link text not null,
  image_url text not null,
  taken_at date not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.galeri enable row level security;

create policy "galeri_public_read" on public.galeri
for select to public using (true);

create policy "galeri_auth_insert" on public.galeri
for insert to authenticated with check (auth.uid() = created_by);

create policy "galeri_auth_update" on public.galeri
for update to authenticated using (auth.uid() = created_by) with check (auth.uid() = created_by);
