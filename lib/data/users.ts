import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function getAllProfiles(): Promise<Profile[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as Profile[]) ?? [];
  } catch {
    return [];
  }
}
