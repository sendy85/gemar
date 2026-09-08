import { createClient } from "@/lib/supabase/server";
import type { BoardMember, Division, Member, MemberPublic } from "@/types/database";

// Anggota publik — selalu lewat view `members_public` (hanya kolom aman,
// hanya status aktif). Jangan pernah query tabel `members` langsung dari
// halaman publik.
export async function getPublicMembers(divisionId?: string): Promise<MemberPublic[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("members_public")
      .select("*")
      .order("full_name", { ascending: true });

    if (divisionId) {
      query = query.eq("division_id", divisionId);
    }

    const { data } = await query;
    return (data as MemberPublic[]) ?? [];
  } catch {
    return [];
  }
}

export interface DivisionWithCount extends Division {
  member_count: number;
}

export async function getDivisionsWithCount(): Promise<DivisionWithCount[]> {
  try {
    const supabase = await createClient();
    const [divisionsRes, membersRes] = await Promise.all([
      supabase.from("divisions").select("*").order("name", { ascending: true }),
      supabase.from("members_public").select("division_id"),
    ]);

    const divisions = (divisionsRes.data as Division[]) ?? [];
    const members = (membersRes.data as { division_id: string | null }[]) ?? [];

    const counts = new Map<string, number>();
    for (const m of members) {
      if (!m.division_id) continue;
      counts.set(m.division_id, (counts.get(m.division_id) ?? 0) + 1);
    }

    return divisions.map((d) => ({
      ...d,
      member_count: counts.get(d.id) ?? 0,
    }));
  } catch {
    return [];
  }
}

export interface BoardMemberWithDivision extends BoardMember {
  division_name: string | null;
}

export async function getBoardMembers(): Promise<BoardMemberWithDivision[]> {
  try {
    const supabase = await createClient();
    const [boardRes, divisionsRes] = await Promise.all([
      supabase
        .from("board_members")
        .select("*")
        .order("period", { ascending: false })
        .order("order_index", { ascending: true }),
      supabase.from("divisions").select("*"),
    ]);

    const board = (boardRes.data as BoardMember[]) ?? [];
    const divisions = (divisionsRes.data as Division[]) ?? [];
    const divisionMap = new Map(divisions.map((d) => [d.id, d.name]));

    return board.map((b) => ({
      ...b,
      division_name: b.division_id ? divisionMap.get(b.division_id) ?? null : null,
    }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------
// Fungsi untuk dashboard admin — data lengkap (bukan view publik), hanya
// dipanggil dari halaman yang sudah dilindungi requireRole(STAFF_ROLES).
// ---------------------------------------------------------------------

export async function getAllMembersAdmin(): Promise<Member[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("members")
      .select("*")
      .order("full_name", { ascending: true });
    return (data as Member[]) ?? [];
  } catch {
    return [];
  }
}

export async function getMemberById(id: string): Promise<Member | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("id", id)
      .single();
    return (data ?? null) as Member | null;
  } catch {
    return null;
  }
}

export async function getAllDivisions(): Promise<Division[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("divisions")
      .select("*")
      .order("name", { ascending: true });
    return (data as Division[]) ?? [];
  } catch {
    return [];
  }
}

export async function getBoardMemberById(id: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("board_members")
      .select("*")
      .eq("id", id)
      .single();
    return (data ?? null) as BoardMember | null;
  } catch {
    return null;
  }
}
