# BEM FTEIC Front-End

Website resmi BEM FTEIC berbasis Next.js (App Router) dengan public pages + admin dashboard, terintegrasi Supabase untuk autentikasi, blog, event, galeri, dan statistik visitor.

## Fitur Utama

### Public pages
- Homepage: hero, about, birokrasi, event, blog, location
- Blog list + detail (`/blog`, `/blog/[id]`)
- Event list + filter department + detail (`/event`, `/event/[department]`, `/event/read/[id]`)
- Galeri (`/galeri`)
- Kabinet (`/kabinet/[slug]`, `/kabinet/struktur`)

### Authentication
- Login, signup, check inbox, confirm email
- Sinkronisasi profil user (nama + avatar) dengan Supabase Auth

### Admin dashboard
- Overview statistik (blog, event, galeri, visitors)
- CRUD Blog:
  - `/dashboard/blog/overview`
  - `/dashboard/blog/create`
  - `/dashboard/blog/edit?id=<id>`
- CRUD Event:
  - `/dashboard/event/overview`
  - `/dashboard/event/create`
  - `/dashboard/event/edit?id=<id>`
- CRUD Galeri:
  - `/dashboard/galeri/overview`
  - `/dashboard/galeri/create`
  - `/dashboard/galeri/edit?id=<id>`

## Tech Stack
- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- Supabase (Auth, Postgres, Storage)
- Biome (lint/format)

## Struktur Project
- `src/app` - routes (public, auth, dashboard, API)
- `src/features/auth` - auth flow, profile service/store
- `src/features/blog` - logic blog (public + dashboard)
- `src/features/event` - logic event (public + dashboard)
- `src/features/galeri` - logic galeri (public + dashboard)
- `src/features/dashboard` - komponen/halaman dashboard
- `src/layouts` - global + dashboard layout/navigation

## Local Development

### Prasyarat
- Node.js 18+ (disarankan 20+)
- pnpm

### Jalankan lokal
1. Install dependencies
```bash
pnpm install
```

2. Buat environment file
```bash
cp .env.example .env.local
```
Atau di PowerShell:
```powershell
Copy-Item .env.example .env.local
```
Lalu isi nilai Supabase sesuai project kamu.

3. Start dev server
```bash
pnpm dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

## Environment Variables

Lihat acuan lengkap di `.env.example`.

### Wajib
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Opsional
- `NEXT_PUBLIC_RUN_MODE` (`development`/`production`)
- `NEXT_PUBLIC_API_URL_DEV`
- `NEXT_PUBLIC_API_URL_PROD`
- `NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET`
- `NEXT_PUBLIC_SUPABASE_BLOG_COVER_BUCKET`
- `NEXT_PUBLIC_SUPABASE_EVENT_COVER_BUCKET`
- `NEXT_PUBLIC_SUPABASE_GALERI_BUCKET`

## Scripts
- `pnpm dev` - jalankan development server
- `pnpm build` - build production
- `pnpm start` - jalankan hasil build
- `pnpm postbuild` - generate sitemap
- `pnpm lint` - lint check (Biome)
- `pnpm lint:write` - auto-fix lint issues
- `pnpm format` - cek formatting
- `pnpm format:write` - auto-format
- `pnpm check` - lint + format check (Biome)
- `pnpm check:write` - auto-fix check issues
- `pnpm typecheck` - TypeScript type check
- `pnpm validate` - check + typecheck

## Supabase Setup

### 1. Auth configuration
- Enable Email provider
- Set site URL dan redirect URL:
  - `http://localhost:3000/confirm-email` (local)
  - production URL setara

### 1.1 Supabase confirm email template
Copy ini ke `Authentication > Email Templates > Confirm signup`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Konfirmasi Email</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: linear-gradient(180deg, #4f73e4 0%, #dfe3ef 100%);
    "
  >
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding: 56px 16px">
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              max-width: 620px;
              background: #f5f5f5;
              border-radius: 16px;
            "
          >
            <tr>
              <td align="center" style="padding: 40px 24px 20px 24px">
                <div style="font-size: 26px; line-height: 1; color: #e0b14d">✉</div>
                <div
                  style="
                    margin-top: 10px;
                    font-size: 34px;
                    line-height: 1;
                    font-weight: 800;
                    color: #e0b14d;
                    letter-spacing: 1px;
                  "
                >
                  ELECTICS
                </div>

                <div
                  style="
                    margin-top: 34px;
                    font-size: 38px;
                    line-height: 1.15;
                    font-weight: 800;
                    color: #1f1f1f;
                  "
                >
                  Konfirmasi Email
                </div>

                <div
                  style="
                    margin-top: 18px;
                    font-size: 24px;
                    line-height: 1.35;
                    font-weight: 700;
                    color: #2a2a2a;
                  "
                >
                  Klik tombol <span style="color: #e0b14d">Confirm</span> untuk<br />
                  melakukan konfirmasi akun<br />
                  Electics - mu
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 16px 16px 16px">
                <a
                  href="{{ .ConfirmationURL }}"
                  style="
                    display: block;
                    width: 100%;
                    box-sizing: border-box;
                    text-align: center;
                    text-decoration: none;
                    text-transform: uppercase;
                    font-size: 40px;
                    line-height: 1.2;
                    font-weight: 800;
                    color: #111111;
                    background: #e0b14d;
                    border-radius: 14px;
                    padding: 20px 18px;
                  "
                >
                  Confirm
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

### 2. Profiles table
```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  username text not null,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
for select to authenticated using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
for insert to authenticated with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
```

### 3. Signup whitelist
```sql
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

create policy "signup_whitelist_auth_read" on public.signup_whitelist
for select to authenticated using (true);

create policy "signup_whitelist_auth_insert" on public.signup_whitelist
for insert to authenticated with check (auth.uid() = created_by);

create policy "signup_whitelist_auth_delete" on public.signup_whitelist
for delete to authenticated using (true);

create or replace function public.is_signup_email_whitelisted(candidate_email text)
returns boolean
language sql
security definer
set search_path = public
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
```

### 4. Blogs table
```sql
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
```

### 5. Events table
```sql
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
```

### 6. Galeri table
```sql
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
```

### 7. Storage buckets
Buat bucket public berikut:
- `avatars`
- `blog-covers`
- `event-covers`
- `galeri-images`

Untuk tiap bucket, gunakan policy:
- public `select`
- authenticated `insert/update` hanya di folder miliknya:
  - `(storage.foldername(name))[1] = auth.uid()::text`

### 8. Visitor analytics table (dashboard Visitors card)
```sql
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
```

## Deployment (Vercel)
1. Set semua env vars yang dibutuhkan di Project Settings
2. Tambahkan production URL ke Supabase Auth Redirect URLs
3. Redeploy

## Opsional: Backfill creator username
Kalau ada data blog/event lama yang kolom `author`-nya masih berisi email, jalankan script berikut di Supabase SQL Editor:

- [docs/sql/backfill-creator-usernames.sql](docs/sql/backfill-creator-usernames.sql)

(18/03/2026)
