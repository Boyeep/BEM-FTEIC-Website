-- Blogs table

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  author text not null,
  category text not null,
  cover_image text not null,
  content text not null,
  status text not null default 'PUBLISHED',
  published_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blogs enable row level security;

create policy "blogs_public_read_published" on public.blogs
for select to public using (status = 'PUBLISHED');

create policy "blogs_auth_read_all" on public.blogs
for select to authenticated using (true);

create policy "blogs_auth_insert" on public.blogs
for insert to authenticated with check (auth.uid() = created_by);

create policy "blogs_auth_update" on public.blogs
for update to authenticated using (auth.uid() = created_by) with check (auth.uid() = created_by);
