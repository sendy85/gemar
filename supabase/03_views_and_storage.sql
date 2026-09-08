-- =====================================================================
-- GEMARI — 03_views_and_storage.sql
-- View publik (privasi anggota) + Supabase Storage buckets & policies
-- Jalankan setelah 01_schema.sql dan 02_rls.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- members_public — view read-only untuk halaman publik.
-- Hanya menampilkan data yang aman dipublikasikan (nama, foto, divisi,
-- status, tahun bergabung). TIDAK menampilkan alamat, no. telepon,
-- atau tanggal lahir lengkap.
-- ---------------------------------------------------------------------
create or replace view members_public as
select
  m.id,
  m.full_name,
  m.photo_url,
  m.division_id,
  d.name as division_name,
  m.status,
  m.join_year
from members m
left join divisions d on d.id = m.division_id
where m.status = 'aktif';

grant select on members_public to anon, authenticated;

-- ---------------------------------------------------------------------
-- Storage buckets
-- Jalankan bagian ini di SQL editor, atau buat bucket via Dashboard
-- Storage > New bucket dengan nama & public setting yang sama.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('gemari-photos', 'gemari-photos', true),   -- foto anggota, pengurus, kegiatan, galeri, logo
  ('gemari-documents', 'gemari-documents', false) -- dokumen (proposal, LPJ, notulen, dll)
on conflict (id) do nothing;

-- Foto: publik boleh lihat, hanya pengurus/admin boleh upload/hapus
create policy "gemari_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'gemari-photos');

create policy "gemari_photos_staff_insert"
  on storage.objects for insert
  with check (bucket_id = 'gemari-photos' and is_pengurus_or_admin());

create policy "gemari_photos_staff_update"
  on storage.objects for update
  using (bucket_id = 'gemari-photos' and is_pengurus_or_admin());

create policy "gemari_photos_staff_delete"
  on storage.objects for delete
  using (bucket_id = 'gemari-photos' and is_pengurus_or_admin());

-- Dokumen: akses baca ditentukan oleh kolom `is_public` pada baris
-- `documents` yang bersangkutan (bukan hanya status login). Pengurus/admin
-- selalu bisa membaca semua dokumen. File diunduh lewat signed URL yang
-- dibuat di server (lihat app/dokumen/download/[id]/route.ts), bukan lewat
-- URL publik langsung — bucket ini sengaja dibuat privat (public: false).
create policy "gemari_documents_read"
  on storage.objects for select
  using (
    bucket_id = 'gemari-documents'
    and (
      is_pengurus_or_admin()
      or exists (
        select 1 from public.documents d
        where d.file_url = storage.objects.name
          and d.is_public = true
      )
    )
  );

create policy "gemari_documents_staff_insert"
  on storage.objects for insert
  with check (bucket_id = 'gemari-documents' and is_pengurus_or_admin());

create policy "gemari_documents_staff_update"
  on storage.objects for update
  using (bucket_id = 'gemari-documents' and is_pengurus_or_admin());

create policy "gemari_documents_staff_delete"
  on storage.objects for delete
  using (bucket_id = 'gemari-documents' and is_pengurus_or_admin());
