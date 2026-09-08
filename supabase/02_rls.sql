-- =====================================================================
-- GEMARI — Gerakan Muda Mudi Blimbingsari
-- 02_rls.sql — Row Level Security policies
-- Jalankan setelah 01_schema.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- Helper functions (security definer agar tidak memicu recursive RLS
-- saat membaca tabel profiles dari dalam policy tabel lain)
-- ---------------------------------------------------------------------
create or replace function auth_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable security definer set search_path = public;

create or replace function is_admin()
returns boolean as $$
  select auth_role() = 'admin';
$$ language sql stable security definer set search_path = public;

create or replace function is_pengurus_or_admin()
returns boolean as $$
  select auth_role() in ('admin', 'pengurus');
$$ language sql stable security definer set search_path = public;

-- ---------------------------------------------------------------------
-- Enable RLS di semua tabel
-- ---------------------------------------------------------------------
alter table profiles enable row level security;
alter table divisions enable row level security;
alter table members enable row level security;
alter table board_members enable row level security;
alter table org_structure enable row level security;
alter table activities enable row level security;
alter table agendas enable row level security;
alter table announcements enable row level security;
alter table financial_transactions enable row level security;
alter table gallery enable row level security;
alter table documents enable row level security;

-- ---------------------------------------------------------------------
-- profiles
-- Setiap user hanya boleh baca/update profil sendiri. Admin boleh semua.
-- Role hanya boleh diubah oleh admin (dicek lewat kolom terpisah di UI +
-- policy update terbatas), user biasa tidak boleh menaikkan role sendiri.
-- ---------------------------------------------------------------------
create policy "profiles_select_own_or_admin"
  on profiles for select
  using (id = auth.uid() or is_admin());

create policy "profiles_update_own_limited"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_admin_all"
  on profiles for all
  using (is_admin())
  with check (is_admin());

-- ---------------------------------------------------------------------
-- divisions — publik boleh baca, hanya pengurus/admin boleh tulis
-- ---------------------------------------------------------------------
create policy "divisions_public_read"
  on divisions for select
  using (true);

create policy "divisions_manage_by_staff"
  on divisions for insert with check (is_pengurus_or_admin());
create policy "divisions_update_by_staff"
  on divisions for update using (is_pengurus_or_admin());
create policy "divisions_delete_by_staff"
  on divisions for delete using (is_pengurus_or_admin());

-- ---------------------------------------------------------------------
-- members — data sensitif. TIDAK ada akses publik/anon langsung ke
-- tabel ini. Halaman publik wajib memakai view members_public (lihat
-- 03_views.sql) yang hanya expose kolom non-privasi.
-- ---------------------------------------------------------------------
create policy "members_select_authenticated"
  on members for select
  using (auth.role() = 'authenticated');

create policy "members_manage_by_staff_insert"
  on members for insert with check (is_pengurus_or_admin());
create policy "members_manage_by_staff_update"
  on members for update using (is_pengurus_or_admin());
create policy "members_manage_by_staff_delete"
  on members for delete using (is_pengurus_or_admin());

-- ---------------------------------------------------------------------
-- board_members (pengurus) — publik boleh baca (untuk halaman profil)
-- ---------------------------------------------------------------------
create policy "board_members_public_read"
  on board_members for select using (true);
create policy "board_members_manage_insert"
  on board_members for insert with check (is_pengurus_or_admin());
create policy "board_members_manage_update"
  on board_members for update using (is_pengurus_or_admin());
create policy "board_members_manage_delete"
  on board_members for delete using (is_pengurus_or_admin());

-- ---------------------------------------------------------------------
-- org_structure — publik boleh baca
-- ---------------------------------------------------------------------
create policy "org_structure_public_read"
  on org_structure for select using (true);
create policy "org_structure_manage_insert"
  on org_structure for insert with check (is_pengurus_or_admin());
create policy "org_structure_manage_update"
  on org_structure for update using (is_pengurus_or_admin());
create policy "org_structure_manage_delete"
  on org_structure for delete using (is_pengurus_or_admin());

-- ---------------------------------------------------------------------
-- activities — publik boleh baca
-- ---------------------------------------------------------------------
create policy "activities_public_read"
  on activities for select using (true);
create policy "activities_manage_insert"
  on activities for insert with check (is_pengurus_or_admin());
create policy "activities_manage_update"
  on activities for update using (is_pengurus_or_admin());
create policy "activities_manage_delete"
  on activities for delete using (is_pengurus_or_admin());

-- ---------------------------------------------------------------------
-- agendas — publik boleh baca
-- ---------------------------------------------------------------------
create policy "agendas_public_read"
  on agendas for select using (true);
create policy "agendas_manage_insert"
  on agendas for insert with check (is_pengurus_or_admin());
create policy "agendas_manage_update"
  on agendas for update using (is_pengurus_or_admin());
create policy "agendas_manage_delete"
  on agendas for delete using (is_pengurus_or_admin());

-- ---------------------------------------------------------------------
-- announcements — publik boleh baca
-- ---------------------------------------------------------------------
create policy "announcements_public_read"
  on announcements for select using (true);
create policy "announcements_manage_insert"
  on announcements for insert with check (is_pengurus_or_admin());
create policy "announcements_manage_update"
  on announcements for update using (is_pengurus_or_admin());
create policy "announcements_manage_delete"
  on announcements for delete using (is_pengurus_or_admin());

-- ---------------------------------------------------------------------
-- financial_transactions — dibaca publik untuk transparansi keuangan
-- organisasi (sesuai struktur menu publik "Keuangan" di navbar).
-- Hanya pengurus/admin yang boleh menulis. Jika transparansi publik
-- TIDAK diinginkan, ganti "using (true)" di bawah menjadi
-- "using (auth.role() = 'authenticated')".
-- ---------------------------------------------------------------------
create policy "financial_public_read"
  on financial_transactions for select using (true);
create policy "financial_manage_insert"
  on financial_transactions for insert with check (is_pengurus_or_admin());
create policy "financial_manage_update"
  on financial_transactions for update using (is_pengurus_or_admin());
create policy "financial_manage_delete"
  on financial_transactions for delete using (is_pengurus_or_admin());

-- ---------------------------------------------------------------------
-- gallery — publik boleh baca
-- ---------------------------------------------------------------------
create policy "gallery_public_read"
  on gallery for select using (true);
create policy "gallery_manage_insert"
  on gallery for insert with check (is_pengurus_or_admin());
create policy "gallery_manage_update"
  on gallery for update using (is_pengurus_or_admin());
create policy "gallery_manage_delete"
  on gallery for delete using (is_pengurus_or_admin());

-- ---------------------------------------------------------------------
-- documents — publik hanya boleh baca dokumen is_public = true.
-- User login (anggota ke atas) boleh baca semua dokumen is_public true
-- + pengurus/admin boleh baca & kelola semua dokumen.
-- ---------------------------------------------------------------------
create policy "documents_public_read"
  on documents for select
  using (is_public = true or is_pengurus_or_admin());

create policy "documents_manage_insert"
  on documents for insert with check (is_pengurus_or_admin());
create policy "documents_manage_update"
  on documents for update using (is_pengurus_or_admin());
create policy "documents_manage_delete"
  on documents for delete using (is_pengurus_or_admin());
