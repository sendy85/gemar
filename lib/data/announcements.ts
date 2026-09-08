import { createClient } from "@/lib/supabase/server";
import type { Announcement } from "@/types/database";

export async function getAllAnnouncements(): Promise<Announcement[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("announcement_date", { ascending: false });
    return (data as Announcement[]) ?? [];
  } catch {
    return [];
  }
}

export async function getAnnouncementBySlug(slug: string): Promise<Announcement | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("slug", slug)
      .single();
    return (data ?? null) as Announcement | null;
  } catch {
    return null;
  }
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("id", id)
      .single();
    return (data ?? null) as Announcement | null;
  } catch {
    return null;
  }
}
