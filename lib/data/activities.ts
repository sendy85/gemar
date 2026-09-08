import { createClient } from "@/lib/supabase/server";
import type { Activity, ActivityStatus } from "@/types/database";

export async function getActivities(status?: ActivityStatus): Promise<Activity[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("activities")
      .select("*")
      .order("activity_date", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data } = await query;
    return (data as Activity[]) ?? [];
  } catch {
    return [];
  }
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("activities")
      .select("*")
      .eq("slug", slug)
      .single();
    return (data ?? null) as Activity | null;
  } catch {
    return null;
  }
}

export async function getActivityById(id: string): Promise<Activity | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("activities")
      .select("*")
      .eq("id", id)
      .single();
    return (data ?? null) as Activity | null;
  } catch {
    return null;
  }
}
