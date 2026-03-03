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
