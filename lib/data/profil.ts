import { createClient } from "@/lib/supabase/server";
import type { BoardMember, OrgStructureNode } from "@/types/database";

export interface StructureNode extends OrgStructureNode {
  board_member: BoardMember | null;
  children: StructureNode[];
}

export async function getOrgStructure(): Promise<StructureNode[]> {
  try {
    const supabase = await createClient();
    const [nodesRes, membersRes] = await Promise.all([
      supabase.from("org_structure").select("*").order("order_index", { ascending: true }),
      supabase.from("board_members").select("*"),
    ]);

    const nodes = (nodesRes.data as OrgStructureNode[]) ?? [];
    const members = (membersRes.data as BoardMember[]) ?? [];
    const memberMap = new Map(members.map((m) => [m.id, m]));

    const enriched: StructureNode[] = nodes.map((n) => ({
      ...n,
      board_member: n.board_member_id ? memberMap.get(n.board_member_id) ?? null : null,
      children: [],
    }));

    const byId = new Map(enriched.map((n) => [n.id, n]));
    const roots: StructureNode[] = [];

    for (const node of enriched) {
      if (node.parent_id && byId.has(node.parent_id)) {
        byId.get(node.parent_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------
// Untuk dashboard admin: daftar flat (bukan tree) supaya mudah dikelola
// dalam bentuk tabel, lengkap dengan label pengurus & induk untuk tampilan.
// ---------------------------------------------------------------------
export interface StructureNodeFlat extends OrgStructureNode {
  board_member_name: string | null;
  parent_title: string | null;
}

export async function getOrgStructureFlat(): Promise<StructureNodeFlat[]> {
  try {
    const supabase = await createClient();
    const [nodesRes, membersRes] = await Promise.all([
      supabase.from("org_structure").select("*").order("order_index", { ascending: true }),
      supabase.from("board_members").select("*"),
    ]);

    const nodes = (nodesRes.data as OrgStructureNode[]) ?? [];
    const members = (membersRes.data as BoardMember[]) ?? [];
    const memberMap = new Map(members.map((m) => [m.id, m.full_name]));
    const nodeTitleMap = new Map(nodes.map((n) => [n.id, n.title]));

    return nodes.map((n) => ({
      ...n,
      board_member_name: n.board_member_id ? memberMap.get(n.board_member_id) ?? null : null,
      parent_title: n.parent_id ? nodeTitleMap.get(n.parent_id) ?? null : null,
    }));
  } catch {
    return [];
  }
}

export async function getStructureNodeById(id: string): Promise<OrgStructureNode | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("org_structure")
      .select("*")
      .eq("id", id)
      .single();
    return (data ?? null) as OrgStructureNode | null;
  } catch {
    return null;
  }
}
