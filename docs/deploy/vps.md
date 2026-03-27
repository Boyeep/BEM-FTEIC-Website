# Deployment VPS (Docker + Nginx)

Panduan ini menjalankan app Next.js ini di VPS dengan 2 container:

- `app` untuk Next.js production server
- `nginx` untuk reverse proxy di port `80`

## Prasyarat

- VPS Linux dengan Docker Engine dan Docker Compose plugin
- DNS domain/subdomain yang sudah diarahkan ke IP VPS
- Semua env Supabase production sudah siap

## 1. Siapkan environment file

Buat file `.env.production` di root project. File ini dipakai untuk:

- environment container saat runtime
- environment build-time saat image Next.js dibuat

Contoh minimal:

```env
NEXT_PUBLIC_RUN_MODE=production
NEXT_PUBLIC_API_URL_PROD=https://example.com/api
NEXT_PUBLIC_SITE_URL=https://example.com

NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET=avatars
NEXT_PUBLIC_SUPABASE_BLOG_COVER_BUCKET=blog-covers
NEXT_PUBLIC_SUPABASE_EVENT_COVER_BUCKET=event-covers
NEXT_PUBLIC_SUPABASE_GALERI_BUCKET=galeri-images
```

Catatan:

- Jika frontend dan API route repo ini berjalan di domain yang sama, isi `NEXT_PUBLIC_API_URL_PROD` dengan `https://domain-kamu.com/api`
- `NEXT_PUBLIC_SITE_URL` harus sama dengan domain public aplikasi
- `NEXT_PUBLIC_RUN_MODE` harus `production`

## 2. Build dan jalankan container

Dari root project, jalankan:

```bash
docker compose up -d --build
```

Untuk melihat status:

```bash
docker compose ps
```

Untuk melihat log:

```bash
docker compose logs -f app
docker compose logs -f nginx
```

## 3. Update Supabase

Pastikan Supabase memakai URL production:

- `Site URL` = `https://domain-kamu.com`
- Tambahkan redirect URL email confirmation production
- Pastikan bucket storage yang dipakai app memang sudah ada

## 4. HTTPS

Config Nginx yang disediakan hanya menangani HTTP port `80`.

Untuk production public, lanjutkan salah satu:

- pasang TLS di Nginx + Certbot
- taruh app ini di belakang reverse proxy/load balancer yang sudah menangani HTTPS

## 5. Update aplikasi

Setelah pull perubahan terbaru:

```bash
docker compose up -d --build
```

## File yang dipakai

- `Dockerfile`
- `docker-compose.yml`
- `deploy/nginx/default.conf`
