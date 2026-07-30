# BEM FTEIC Website

Frontend resmi BEM FTEIC berbasis Next.js App Router. Seluruh data konten publik dan admin melewati Go API; Supabase client di browser hanya digunakan untuk autentikasi.

## Production

- Website: <https://bem-fteic.com>
- API: <https://api.bem-fteic.com>
- Runtime: Docker Compose di VPS, frontend pada port grup `8001`
- Database dan autentikasi: Supabase
- Deployment: GitHub Actions setiap push ke `main`

`www.bem-fteic.com` diarahkan ke domain utama. Vercel tidak digunakan sebagai runtime production.

## Fitur

- Homepage, blog, event, galeri, dan halaman kabinet
- Login, signup whitelist, konfirmasi email, dan session cookie aman
- Dashboard dengan role `admin`
- CRUD blog, event, dan galeri melalui backend
- Pengelolaan profil dan signup whitelist
- Upload gambar melalui backend
- Sitemap dan metadata SEO

## Stack

- Next.js 16 dan React 19
- TypeScript dan Tailwind CSS
- TanStack Query dan Zustand
- Supabase Auth serta PostgreSQL
- Biome
- Vitest
- Docker Compose dan Nginx

## Struktur

```text
src/app/           route App Router
src/features/      fitur dan domain logic
src/components/    komponen UI bersama
src/layouts/       navbar, footer, dan app shell
src/lib/           API contract, query keys, pagination, dan utilitas
deploy/nginx/      reverse proxy container frontend
docs/deploy/       catatan operasional VPS
```

Skema database tidak disimpan di frontend. Sumber migrasi resmi berada di repository backend pada `database/migrations`.

## Menjalankan Lokal

Prasyarat:

- Node.js 22+
- pnpm 9
- backend lokal atau API production yang dapat diakses
- project Supabase

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

PowerShell:

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Aplikasi tersedia di <http://localhost:3000>.

## Environment

Gunakan `.env.example` sebagai acuan:

```env
NEXT_PUBLIC_API_URL_DEV=http://localhost:8080
NEXT_PUBLIC_API_URL_PROD=https://api.bem-fteic.com
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://bem-fteic.com
```

Jangan commit `.env.local`, `.env.production`, service-role key, database password, atau SSH private key.

## Supabase

Konfigurasi Auth production:

- Site URL: `https://bem-fteic.com`
- Redirect URL: `https://bem-fteic.com/**`
- Redirect URL: `https://www.bem-fteic.com/**`
- Redirect URL lokal: `http://localhost:3000/**`
- Before User Created hook: schema `public`, function `hook_validate_signup`

Frontend hanya menggunakan anon key untuk Supabase Auth. Otorisasi admin, validasi input, query/mutation konten, pagination, dan media lifecycle dilakukan backend. Migrasi backend mengelola tabel, fungsi, trigger, grant, dan RLS.

## Quality Checks

```bash
pnpm validate
pnpm test
pnpm build
pnpm audit --prod --audit-level=high
```

## Deployment

Push ke `main` menjalankan validasi, membangun image bertag commit SHA, dan melakukan deployment ke VPS menggunakan:

```bash
sudo docker compose -p group1 up -d
```

Workflow melakukan readiness check dan rollback ke image terakhir yang berhasil apabila deployment gagal. Detail operasional terdapat di [docs/deploy/vps.md](docs/deploy/vps.md).

Konfigurasi domain grup berada di:

```text
/nginx-configs/group1/group1.conf
```

Terapkan perubahan dengan:

```bash
sudo apply-nginx-group1.sh
```

Mapping production:

- `bem-fteic.com` dan `www.bem-fteic.com` → `127.0.0.1:8001`
- `api.bem-fteic.com` → `127.0.0.1:8002`

Jangan menjalankan `setup-domain-group1.sh` setelah mapping khusus ini tanpa mengecek ulang config, karena script tersebut mengarahkan seluruh hostname ke port frontend.
