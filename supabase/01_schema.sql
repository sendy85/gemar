-- =====================================================================
-- GEMARI — Gerakan Muda Mudi Blimbingsari
-- 01_schema.sql — Database schema (tables, enums, triggers)
-- Jalankan file ini terlebih dahulu, lalu 02_rls.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
create type user_role as enum ('admin', 'pengurus', 'anggota');
create type member_status as enum ('aktif', 'tidak_aktif');
create type gender_type as enum ('laki_laki', 'perempuan');
create type activity_status as enum ('akan_datang', 'berlangsung', 'selesai');
create type agenda_status as enum ('akan_datang', 'berlangsung', 'selesai');
create type transaction_type as enum ('pemasukan', 'pengeluaran');
create type document_category as enum (
  'proposal', 'lpj', 'notulen', 'ad_art', 'surat', 'lainnya'
);

-- ---------------------------------------------------------------------
-- profiles — 1:1 dengan auth.users, menyimpan role & identitas
-- ---------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  avatar_url text,
  role user_role not null default 'anggota',
  member_id uuid, -- FK ditambahkan setelah tabel members dibuat
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- divisions — Divisi organisasi
-- ---------------------------------------------------------------------
create table divisions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  head_name text, -- nama ketua divisi (teks bebas, tidak wajib FK ke members)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- members — Data anggota
-- ---------------------------------------------------------------------
create table members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  photo_url text,
  gender gender_type,
  birth_date date,
  address text,
  phone_number text,
  division_id uuid references divisions (id) on delete set null,
  status member_status not null default 'aktif',
  join_year integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles
  add constraint profiles_member_id_fkey
  foreign key (member_id) references members (id) on delete set null;

-- ---------------------------------------------------------------------
-- board_members — Data pengurus (jabatan struktural per periode)
-- ---------------------------------------------------------------------
create table board_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  photo_url text,
  position_title text not null, -- jabatan, mis. "Ketua", "Sekretaris"
  division_id uuid references divisions (id) on delete set null,
  period text not null, -- mis. "2026/2027"
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- org_structure — Struktur organisasi visual (hierarki)
-- Setiap node bisa merujuk ke board_members dan punya parent (atasan)
-- ---------------------------------------------------------------------
create table org_structure (
  id uuid primary key default gen_random_uuid(),
  board_member_id uuid references board_members (id) on delete set null,
  title text not null, -- label jabatan yang ditampilkan di struktur
  parent_id uuid references org_structure (id) on delete cascade,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- activities — Kegiatan
-- ---------------------------------------------------------------------
create table activities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  activity_date date not null,
  activity_time time,
  location text,
  description text,
  photo_url text,
  status activity_status not null default 'akan_datang',
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- agendas — Agenda
-- ---------------------------------------------------------------------
create table agendas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  agenda_date date not null,
  agenda_time time,
  location text,
  description text,
  status agenda_status not null default 'akan_datang',
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- announcements — Pengumuman
-- ---------------------------------------------------------------------
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  announcement_date date not null default current_date,
  author text,
  featured boolean not null default false,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- financial_transactions — Transaksi keuangan
-- ---------------------------------------------------------------------
create table financial_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_date date not null,
  transaction_code text not null unique,
  description text not null,
  category text not null,
  type transaction_type not null,
  amount numeric(14, 2) not null check (amount > 0),
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- gallery — Galeri foto kegiatan
-- ---------------------------------------------------------------------
create table gallery (
  id uuid primary key default gen_random_uuid(),
  photo_url text not null,
  title text not null,
  photo_date date not null default current_date,
  description text,
  activity_id uuid references activities (id) on delete set null,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- documents — Dokumen organisasi
-- ---------------------------------------------------------------------
create table documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category document_category not null,
  file_url text not null,
  file_size bigint,
  is_public boolean not null default false, -- true = boleh diakses anggota/publik
  uploaded_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- updated_at auto-update trigger
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger trg_divisions_updated_at before update on divisions
  for each row execute function set_updated_at();
create trigger trg_members_updated_at before update on members
  for each row execute function set_updated_at();
create trigger trg_board_members_updated_at before update on board_members
  for each row execute function set_updated_at();
create trigger trg_activities_updated_at before update on activities
  for each row execute function set_updated_at();
create trigger trg_agendas_updated_at before update on agendas
  for each row execute function set_updated_at();
create trigger trg_announcements_updated_at before update on announcements
  for each row execute function set_updated_at();
create trigger trg_financial_transactions_updated_at before update on financial_transactions
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Auto-create profile saat user baru mendaftar lewat Supabase Auth
-- Default role: anggota. Ubah role via dashboard admin setelah itu.
-- ---------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    'anggota'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------
-- Indexes penting
-- ---------------------------------------------------------------------
create index idx_members_division on members (division_id);
create index idx_members_status on members (status);
create index idx_board_members_division on board_members (division_id);
create index idx_activities_status on activities (status);
create index idx_activities_date on activities (activity_date);
create index idx_agendas_date on agendas (agenda_date);
create index idx_announcements_featured on announcements (featured);
create index idx_financial_transactions_date on financial_transactions (transaction_date);
create index idx_financial_transactions_type on financial_transactions (type);
create index idx_documents_category on documents (category);
create index idx_gallery_activity on gallery (activity_id);
