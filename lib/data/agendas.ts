import { createClient } from "@/lib/supabase/server";
import type { Agenda } from "@/types/database";

export async function getAllAgendas(): Promise<Agenda[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("agendas")
      .select("*")
      .order("agenda_date", { ascending: true });
    return (data as Agenda[]) ?? [];
  } catch {
    return [];
  }
}

export async function getAgendaById(id: string): Promise<Agenda | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("agendas")
      .select("*")
      .eq("id", id)
      .single();
    return (data ?? null) as Agenda | null;
  } catch {
    return null;
  }
}
