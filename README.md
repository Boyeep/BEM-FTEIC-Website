# BEM FTEIC Front-End

Website resmi BEM FTEIC dengan public pages + admin dashboard, terintegrasi Supabase untuk auth, blog, event, dan galeri.

## Features

### Public website
- Homepage sections: hero, about, birokrasi, event, blog, location
- Blog listing and blog detail (`/blog`, `/blog/[id]`)
- Event listing (`/event`)
- Galeri listing (`/galeri`)

### Authentication
- Login, signup, email confirmation flow
- User profile state (persisted) with name and avatar update
- Supabase Auth integration + profile sync

### Admin dashboard
- Overview page with:
  - recent blogs
  - recent events
  - recent galeri photos
  - live stats (including events hosted count)
- Blog CRUD dashboard:
  - `/dashboard/blog/overview`
  - `/dashboard/blog/create`
  - `/dashboard/blog/edit?id=<id>`
- Event CRUD dashboard:
  - `/dashboard/event/overview`
  - `/dashboard/event/create`
  - `/dashboard/event/edit?id=<id>`
- Galeri CRUD dashboard:
  - `/dashboard/galeri/overview`
  - `/dashboard/galeri/create`
  - `/dashboard/galeri/edit?id=<id>`

## Tech Stack
- Next.js 14 (App Router)
- React + TypeScript
- Zustand (auth store)
- TanStack Query
- Tailwind CSS
- Supabase (Auth, Postgres, Storage)

## Project Structure
- `src/app` App routes
- `src/features/auth` Auth flows, profile service/store
- `src/features/blog` Blog public + dashboard logic
- `src/features/event` Event public + dashboard logic
- `src/features/galeri` Galeri public + dashboard logic
- `src/features/dashboard` Dashboard UI pages/forms
- `src/layouts` Global and dashboard navigation/layout

## Local Development

1. Install dependencies
```bash
pnpm install
```

2. Create env file
- Copy `.env.example` to `.env.local`
- Fill with your Supabase values

3. Run app
```bash
pnpm dev
```

## Environment Variables

Required (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

Optional bucket overrides:
- `NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET`
- `NEXT_PUBLIC_SUPABASE_BLOG_COVER_BUCKET`
- `NEXT_PUBLIC_SUPABASE_EVENT_COVER_BUCKET`
- `NEXT_PUBLIC_SUPABASE_GALERI_BUCKET`

## Supabase Setup

### 1. Auth configuration
- Enable Email provider
- Set site URL and redirect URL:
  - `http://localhost:3000/confirm-email` (local)
  - production URL equivalent

### 1.1 Supabase confirm email template
Copy this into `Authentication > Email Templates > Confirm signup`:

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

### 3. Blogs table
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

### 4. Events table
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

### 5. Galeri table
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

### 6. Storage buckets
Create these public buckets:
- `avatars`
- `blog-covers`
- `event-covers`
- `galeri-images`

For each bucket, use policies that allow:
- public `select`
- authenticated `insert/update` only for their own folder:
  - `(storage.foldername(name))[1] = auth.uid()::text`

### 7. Visitor analytics table (dashboard Visitors card)
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

## Deployment

For Vercel:
1. Set all required env vars in Project Settings
2. Add production URL to Supabase Auth redirect URLs
3. Redeploy

## Scripts
- `pnpm dev` run local server
- `pnpm build` production build
- `pnpm start` run production build
- `pnpm lint` lint check
- `pnpm typecheck` TypeScript check
