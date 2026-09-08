import { createClient } from "@/lib/supabase/server";
import type { DocumentCategory, DocumentItem } from "@/types/database";

// RLS pada tabel `documents` sudah membatasi baris yang dikembalikan
// (publik hanya dapat is_public = true, pengurus/admin dapat semua) —
// jadi query di sini tidak perlu filter is_public secara manual.
export async function getDocuments(category?: DocumentCategory): Promise<DocumentItem[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data } = await query;
    return (data as DocumentItem[]) ?? [];
  } catch {
    return [];
  }
}

export async function getDocumentById(id: string): Promise<DocumentItem | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();
    return (data ?? null) as DocumentItem | null;
  } catch {
    return null;
  }
}

// Membuat signed URL sementara (60 detik) untuk mengunduh dokumen.
// Tetap tunduk pada RLS storage.objects — jika pengguna tidak berhak
// (dokumen bukan is_public dan bukan pengurus/admin), Supabase akan
// menolak dan fungsi ini mengembalikan null.
export async function getDocumentSignedUrl(filePath: string): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from("gemari-documents")
      .createSignedUrl(filePath, 60);
    if (error) return null;
    return data?.signedUrl ?? null;
  } catch {
    return null;
  }
}
