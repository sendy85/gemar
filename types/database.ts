// Tipe TypeScript yang merepresentasikan skema Supabase.
// Jika schema SQL diubah, sesuaikan juga file ini
// (atau generate ulang dengan `supabase gen types typescript`).

export type UserRole = "admin" | "pengurus" | "anggota";
export type MemberStatus = "aktif" | "tidak_aktif";
export type GenderType = "laki_laki" | "perempuan";
export type ActivityStatus = "akan_datang" | "berlangsung" | "selesai";
export type AgendaStatus = "akan_datang" | "berlangsung" | "selesai";
export type TransactionType = "pemasukan" | "pengeluaran";
export type DocumentCategory =
  | "proposal"
  | "lpj"
  | "notulen"
  | "ad_art"
  | "surat"
  | "lainnya";

export type Profile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  member_id: string | null;
  created_at: string;
  updated_at: string;
}

export type Division = {
  id: string;
  name: string;
  description: string | null;
  head_name: string | null;
  created_at: string;
  updated_at: string;
}

export type Member = {
  id: string;
  full_name: string;
  photo_url: string | null;
  gender: GenderType | null;
  birth_date: string | null;
  address: string | null;
  phone_number: string | null;
  division_id: string | null;
  status: MemberStatus;
  join_year: number | null;
  created_at: string;
  updated_at: string;
}

export type MemberPublic = {
  id: string;
  full_name: string;
  photo_url: string | null;
  division_id: string | null;
  division_name: string | null;
  status: MemberStatus;
  join_year: number | null;
}

export type BoardMember = {
  id: string;
  full_name: string;
  photo_url: string | null;
  position_title: string;
  division_id: string | null;
  period: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type OrgStructureNode = {
  id: string;
  board_member_id: string | null;
  title: string;
  parent_id: string | null;
  order_index: number;
  created_at: string;
}

export type Activity = {
  id: string;
  name: string;
  slug: string;
  activity_date: string;
  activity_time: string | null;
  location: string | null;
  description: string | null;
  photo_url: string | null;
  status: ActivityStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type Agenda = {
  id: string;
  title: string;
  agenda_date: string;
  agenda_time: string | null;
  location: string | null;
  description: string | null;
  status: AgendaStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type Announcement = {
  id: string;
  title: string;
  slug: string;
  content: string;
  announcement_date: string;
  author: string | null;
  featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type FinancialTransaction = {
  id: string;
  transaction_date: string;
  transaction_code: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type GalleryItem = {
  id: string;
  photo_url: string;
  title: string;
  photo_date: string;
  description: string | null;
  activity_id: string | null;
  created_by: string | null;
  created_at: string;
}

export type DocumentItem = {
  id: string;
  name: string;
  category: DocumentCategory;
  file_url: string;
  file_size: number | null;
  is_public: boolean;
  uploaded_by: string | null;
  created_at: string;
}

// Bentuk minimal Database generic agar kompatibel dengan
// createBrowserClient<Database> / createServerClient<Database>.
// Setiap tabel butuh field `Relationships` (meski kosong) dan schema butuh
// `Functions` supaya @supabase/postgrest-js bisa meng-infer tipe insert/
// update dengan benar (lihat GenericTable & GenericSchema di
// @supabase/postgrest-js). Untuk type-safety penuh pada query builder,
// disarankan generate otomatis lewat Supabase CLI:
// `supabase gen types typescript`.
type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile>;
      divisions: Table<Division>;
      members: Table<Member>;
      board_members: Table<BoardMember>;
      org_structure: Table<OrgStructureNode>;
      activities: Table<Activity>;
      agendas: Table<Agenda>;
      announcements: Table<Announcement>;
      financial_transactions: Table<FinancialTransaction>;
      gallery: Table<GalleryItem>;
      documents: Table<DocumentItem>;
    };
    Views: {
      members_public: { Row: MemberPublic; Relationships: [] };
    };
    Functions: Record<string, never>;
  };
}
