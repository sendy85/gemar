# GEMARI — Gerakan Muda Mudi Blimbingsari

Website organisasi pemuda GEMARI: sisi publik + dashboard admin/pengurus.
Dibangun bertahap — dokumen ini akan diperbarui di setiap tahap.

## Status: Tahap 5 selesai — Semua Tahap Selesai ✅
- [x] Tahap 1 — Setup Next.js, Tailwind, Supabase, Auth, DB schema, RLS, layout dasar
- [x] Tahap 2 — Homepage, navbar dropdown, Profil, Kegiatan, Agenda, Pengumuman
- [x] Tahap 3 — Organisasi (Anggota/Pengurus/Divisi), Galeri, Dokumen
- [x] Tahap 4 — Sistem keuangan publik + export Excel/PDF
- [x] Tahap 5 — **Dashboard admin penuh dengan CRUD nyata di semua modul:**
  - Anggota, Pengurus, Divisi, Struktur Organisasi (upload foto disertakan)
  - Kegiatan, Agenda, Pengumuman (auto-slug, auto-featured)
  - Transaksi Keuangan (kode transaksi otomatis, kategori dinamis sesuai jenis)
  - Galeri (upload foto) & Dokumen (upload file, toggle publik/internal)
  - Pengaturan role pengguna (admin only)
  - Role permission 3 lapis: middleware (`proxy.ts`) → `requireRole()` di server → RLS di database
  - Halaman 404 & error boundary kustom sesuai identitas GEMARI
  - Sidebar & seluruh form dashboard responsive (mobile-first)

Semua CRUD **benar-benar terhubung ke Supabase** — tidak ada data mockup/palsu. Setiap create/update/delete memakai Server Action asli, memvalidasi input, dan memverifikasi role sebelum menyentuh database.

## Cara membuat admin pertama (wajib sebelum pakai dashboard)

1. Daftarkan diri lewat halaman `/login`? **Tidak** — sistem ini tidak punya
   halaman pendaftaran publik (sesuai spesifikasi, hanya ada halaman Login).
   Buat akun pertama lewat **Supabase Dashboard → Authentication → Users →
   Add User** (isi email & password, centang "Auto Confirm").
2. Trigger `handle_new_user` otomatis membuat baris di `profiles` dengan
   role default `anggota`.
3. Jadikan admin lewat SQL Editor:
   ```sql
   update profiles set role = 'admin' where id = '<user-id dari auth.users>';
   ```
4. Login di `/login` dengan akun tadi → menu dashboard admin (termasuk
   **Pengaturan**) akan langsung terlihat. Selanjutnya, akun baru lain bisa
   dinaikkan rolenya lewat halaman **Pengaturan** tanpa perlu SQL lagi.

## Tahap selanjutnya (opsional, di luar cakupan awal)
- Testing otomatis (unit/E2E) — saat ini pengujian dilakukan manual lewat
  `tsc --noEmit`, `next lint`, `next build`, dan smoke-test server produksi
  di setiap tahap
- Deploy ke Vercel (lihat bagian "Deploy ke Vercel" di bawah)

## Catatan penting soal Supabase Storage (dokumen)

Jika kamu **sudah pernah** menjalankan `03_views_and_storage.sql` versi
sebelumnya (dari Tahap 1/2), jalankan tambahan:
```
supabase/04_update_documents_read_policy.sql
```
Ini memperbaiki kebijakan baca bucket `gemari-documents` supaya publik bisa
mengunduh dokumen yang ditandai `is_public = true` oleh pengurus (misalnya
AD/ART), bukan sekadar mengecek status login.

Jika ini instalasi baru, cukup jalankan `01` → `02` → `03` seperti biasa;
perubahan itu sudah termasuk di dalamnya.

## 1. Setup Supabase

1. Buat project baru di https://supabase.com
2. Buka **SQL Editor**, jalankan file berikut **berurutan**:
   1. `supabase/01_schema.sql`
   2. `supabase/02_rls.sql`
   3. `supabase/03_views_and_storage.sql`
3. Buka **Authentication > Providers**, pastikan Email login aktif.
4. Setelah mendaftar user pertama, ubah role-nya jadi `admin` secara manual:
   ```sql
   update profiles set role = 'admin' where id = '<user-id-dari-auth.users>';
   ```
   (Trigger `handle_new_user` otomatis membuat profil baru dengan role `anggota`.)

## 2. Environment Variables

Salin `.env.example` menjadi `.env.local`, lalu isi dengan kredensial dari
Supabase Dashboard > Settings > API:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
```

Jangan pernah commit `.env.local` atau mengekspos `service_role key`.

## 3. Menjalankan project

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## 4. Logo

Ganti `public/logo.svg` dengan logo GEMARI asli (bentuk & warna tidak diubah).
Jika file asli berformat PNG, ganti nama file jadi `logo.png` dan sesuaikan
referensinya di `components/layout/Navbar.tsx` dan `components/layout/Footer.tsx`.

## 5. Deploy ke Vercel

1. Push project ke GitHub
2. Import repo di https://vercel.com/new
3. Tambahkan environment variable yang sama seperti `.env.local`
4. Deploy

## Struktur folder (Tahap 1)

```
app/
  layout.tsx        # Root layout (Navbar + Footer)
  page.tsx           # Homepage (placeholder, dilengkapi Tahap 2)
  login/
    page.tsx
    actions.ts        # Server action login/logout
  dashboard/
    page.tsx           # Placeholder, dilindungi middleware
components/
  layout/
    Navbar.tsx
    Footer.tsx
lib/
  supabase/
    client.ts          # Browser client
    server.ts           # Server client (Server Components/Actions)
    middleware.ts        # Refresh session + proteksi /dashboard
  auth.ts               # getCurrentProfile()
  utils.ts
types/
  database.ts            # Tipe TypeScript sesuai skema SQL
supabase/
  01_schema.sql
  02_rls.sql
  03_views_and_storage.sql
middleware.ts
```
