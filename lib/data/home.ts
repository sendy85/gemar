import { createClient } from "@/lib/supabase/server";
import type { Activity, Agenda, Announcement } from "@/types/database";

// Semua fungsi di file ini dibungkus try/catch dan mengembalikan nilai
// default yang aman (0 / array kosong) jika query gagal — misalnya saat
// project belum terhubung ke Supabase yang sesungguhnya. Ini mencegah
// homepage crash hanya karena statistik gagal dimuat.

export interface HomeStats {
  totalMembers: number;
  totalActivities: number;
  totalAnnouncements: number;
  totalDocuments: number;
}

export async function getHomeStats(): Promise<HomeStats> {
  try {
    const supabase = await createClient();

    const [members, activities, announcements, documents] = await Promise.all([
      supabase.from("members").select("id", { count: "exact", head: true }).eq("status", "aktif"),
      supabase.from("activities").select("id", { count: "exact", head: true }),
      supabase.from("announcements").select("id", { count: "exact", head: true }),
      supabase.from("documents").select("id", { count: "exact", head: true }),
    ]);

    return {
      totalMembers: members.count ?? 0,
      totalActivities: activities.count ?? 0,
      totalAnnouncements: announcements.count ?? 0,
      totalDocuments: documents.count ?? 0,
    };
  } catch {
    return {
      totalMembers: 0,
      totalActivities: 0,
      totalAnnouncements: 0,
      totalDocuments: 0,
    };
  }
}

export async function getFeaturedAnnouncements(limit = 3): Promise<Announcement[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("announcement_date", { ascending: false })
      .limit(limit);
    return (data as Announcement[]) ?? [];
  } catch {
    return [];
  }
}

export async function getUpcomingAgendas(limit = 3): Promise<Agenda[]> {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("agendas")
      .select("*")
      .gte("agenda_date", today)
      .order("agenda_date", { ascending: true })
      .limit(limit);
    return (data as Agenda[]) ?? [];
  } catch {
    return [];
  }
}

export async function getRecentActivities(limit = 3): Promise<Activity[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("activities")
      .select("*")
      .order("activity_date", { ascending: false })
      .limit(limit);
    return (data as Activity[]) ?? [];
  } catch {
    return [];
  }
}
