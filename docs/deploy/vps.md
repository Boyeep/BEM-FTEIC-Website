# Operasional VPS Group 1

Production menggunakan Docker Compose project `group1`.

## Endpoint dan port

| Layanan | Endpoint | Port host |
| --- | --- | --- |
| Frontend | `https://bem-fteic.com` | `8001` |
| Backend | `https://api.bem-fteic.com` | `8002` |

`www.bem-fteic.com` mengarah ke frontend dan melakukan redirect ke domain utama.

## Perintah container

Gunakan hanya Docker Compose dengan project name:

```bash
sudo docker compose -p group1 ps
sudo docker compose -p group1 up -d
sudo docker compose -p group1 down
```

Jangan menggunakan `docker run`, `docker rm`, atau mengakses container kelompok lain.

## Nginx

Source config:

```text
/nginx-configs/group1/group1.conf
```

Mapping yang wajib dipertahankan:

```text
bem-fteic.com www.bem-fteic.com -> 127.0.0.1:8001
api.bem-fteic.com               -> 127.0.0.1:8002
```

Setelah mengubah source config:

```bash
sudo apply-nginx-group1.sh
```

`setup-domain-group1.sh` membuat semua hostname menggunakan port `8001`. Jika script tersebut diperlukan untuk Certbot, pulihkan mapping API ke `8002` dan jalankan apply kembali.

## Deployment otomatis

Push ke branch `main` menjalankan GitHub Actions. Workflow:

1. Menjalankan typecheck, lint, dan production audit.
2. Mengirim source ke `$HOME/app`.
3. Membangun image bertag commit SHA.
4. Menjalankan container dengan `docker compose -p group1`.
5. Melakukan readiness check.
6. Rollback ke image terakhir yang sehat jika readiness gagal.

Secrets GitHub yang diperlukan:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`

File `$HOME/app/.env.production` harus tersedia di VPS dan tidak disimpan di Git.

## Pemeriksaan

```bash
sudo docker compose -p group1 ps
curl --fail https://bem-fteic.com
curl --fail https://api.bem-fteic.com/health
```
