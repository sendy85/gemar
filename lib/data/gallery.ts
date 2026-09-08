import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/types/database";

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("photo_date", { ascending: false });
    return (data as GalleryItem[]) ?? [];
  } catch {
    return [];
  }
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .eq("id", id)
      .single();
    return (data ?? null) as GalleryItem | null;
  } catch {
    return null;
  }
}
