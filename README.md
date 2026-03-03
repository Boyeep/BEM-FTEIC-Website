# Notes for you my guy

## Supabase Auth Setup (current)

1. Copy `.env.example` to `.env.local`.
2. Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. In Supabase Auth settings, set your redirect URL to:
   - `http://localhost:3000/confirm-email` (development)
4. Run:
   - `pnpm install`
   - `pnpm dev`

Auth routes:
- `/login` (email + password)
- `/signup` (creates account and sends verification email)
- `/confirm-email` (handles Supabase callback and creates session)

## Supabase Database Setup (profiles)

Run this SQL in `Supabase -> SQL Editor`:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  username text not null,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
```

This project now reads/writes profile name + email through `public.profiles`.

Create a public storage bucket named `avatars`, then add these storage policies:

```sql
create policy "avatars_select_public"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

create policy "avatars_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatars_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

Optional env:
- `NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET='avatars'`

## Supabase Database Setup (blogs)

Run this SQL in `Supabase -> SQL Editor`:

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

create policy "blogs_public_read_published"
on public.blogs
for select
to public
using (status = 'PUBLISHED');

create policy "blogs_auth_read_all"
on public.blogs
for select
to authenticated
using (true);

create policy "blogs_auth_insert"
on public.blogs
for insert
to authenticated
with check (auth.uid() = created_by);

create policy "blogs_auth_update"
on public.blogs
for update
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);
```

Create a public storage bucket named `blog-covers`, then add storage policies:

```sql
create policy "blog_covers_select_public"
on storage.objects
for select
to public
using (bucket_id = 'blog-covers');

create policy "blog_covers_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'blog-covers'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "blog_covers_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'blog-covers'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

Optional env:
- `NEXT_PUBLIC_SUPABASE_BLOG_COVER_BUCKET='blog-covers'`

## Supabase Database Setup (events)

Run this SQL in `Supabase -> SQL Editor`:

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

create policy "events_public_read"
on public.events
for select
to public
using (true);

create policy "events_auth_insert"
on public.events
for insert
to authenticated
with check (auth.uid() = created_by);

create policy "events_auth_update"
on public.events
for update
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);
```

Create a public storage bucket named `event-covers`, then add storage policies:

```sql
create policy "event_covers_select_public"
on storage.objects
for select
to public
using (bucket_id = 'event-covers');

create policy "event_covers_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'event-covers'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "event_covers_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'event-covers'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

Optional env:
- `NEXT_PUBLIC_SUPABASE_EVENT_COVER_BUCKET='event-covers'`

## Supabase Database Setup (galeri)

Run this SQL in `Supabase -> SQL Editor`:

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

create policy "galeri_public_read"
on public.galeri
for select
to public
using (true);

create policy "galeri_auth_insert"
on public.galeri
for insert
to authenticated
with check (auth.uid() = created_by);

create policy "galeri_auth_update"
on public.galeri
for update
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);
```

Create a public storage bucket named `galeri-images`, then add storage policies:

```sql
create policy "galeri_images_select_public"
on storage.objects
for select
to public
using (bucket_id = 'galeri-images');

create policy "galeri_images_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'galeri-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "galeri_images_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'galeri-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

Optional env:
- `NEXT_PUBLIC_SUPABASE_GALERI_BUCKET='galeri-images'`

nama website di package.json untuk sementara aku bikin "bem-fteic-front-end"

next-sitemap.config.js perlu diubah

.env.example perlu diubah

--

- what have i done:

- bikin project folder front-end:

1. created /app/(auth)/check-inbox/page.tsx
2. created /app/(auth)/confirm-email/page.tsx
3. created /app/(auth)/login/page.tsx
4. created /app/(auth)/signup/page.tsx
5. created /app/(auth)/layout.tsx

--

6. created /src/components/input/Input.tsx

--

7. created /features/auth/components/CheckInboxCard.tsx
8. created /features/auth/components/EmailConfirmCard.tsx
9. created /features/auth/components/LoginForm.tsx
10. created /features/auth/components/SignupForm.tsx

--

11. created /features/auth/hooks/useLoginMutation.ts
12. created /features/auth/hooks/useSignupMutation.ts
13. created /features/auth/hooks/useVerifyEmail.ts

--

14. created /features/auth/services/authService.ts
15. created /features/auth/store/useAuthStore.ts
16. created /features/auth/types.ts

--

17. created /public/robots.txt
18. created /public/sitemap-0.xml
19. created /public/sitemap.xml
- katanya ini 3 untuk SEO idk bruh

--

- Notes: Disetiap file baru ada comment diatas for context

--

- untuk run folder:

1. pnpm install
2. pnpm dev

--

- to check for changes (setelah run pnpm dev):

1. http://localhost:3000/login
2. http://localhost:3000/signup
3. http://localhost:3000/confirm-email
4. http://localhost:3000/check-inbox

--

- what you should done:

1. Bikin homepage
2. intergrate backend dan front-end

--

# Boy


# continuation (2026-03-01)

- update progress:

1. homepage udah dibikin di /src/app/page.tsx
2. route public udah ada: /blog, /blog/[id], /event, /galeri
3. layout global udah ada navbar + footer (auth pages hide navbar/footer)
4. blog udah ada mock API internal:
   - GET /api/blogs?page=1&limit=6
   - GET /api/blogs/:id
5. frontend blog udah consume endpoint internal via axios + react-query
6. auth service udah disiapin (login/signup/confirm-email), tinggal align endpoint backend final

- next focus (biar integration lanjut):

1. samain kontrak API backend untuk auth endpoint (response + error shape)
2. ganti NEXT_PUBLIC_API_URL_PROD dan SITE_URL sesuai env deploy
3. rapikan metadata app (title/description di src/app/layout.tsx)
4. isi link real untuk navbar/footer (sekarang beberapa masih '#')
