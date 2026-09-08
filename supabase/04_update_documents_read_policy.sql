-- =====================================================================
-- GEMARI — 04_update_documents_read_policy.sql
-- HANYA perlu dijalankan jika kamu sudah menjalankan
-- 03_views_and_storage.sql versi Tahap 1/2 sebelumnya.
--
-- Kalau ini instalasi baru (belum pernah menjalankan file SQL apa pun),
-- LEWATI file ini — 03_views_and_storage.sql versi terbaru sudah
-- termasuk perubahan ini.
--
-- Perubahan: kebijakan baca (SELECT) untuk bucket 'gemari-documents'
-- sebelumnya hanya mengecek "sudah login atau belum". Sekarang diikat ke
-- kolom is_public pada baris `documents` yang bersangkutan, supaya
-- pengunjung publik (belum login) juga bisa mengunduh dokumen yang memang
-- ditandai publik oleh pengurus (mis. AD/ART), sesuai menu "Dokumen" yang
-- tampil di navbar publik.
-- =====================================================================

drop policy if exists "gemari_documents_staff_read" on storage.objects;
drop policy if exists "gemari_documents_read" on storage.objects;

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
