import { createClient } from "@/lib/supabase/server";

function safeFileName(originalName: string) {
  const ext = originalName.includes(".")
    ? originalName.slice(originalName.lastIndexOf("."))
    : "";
  const random = crypto.randomUUID();
  return `${random}${ext}`;
}

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20 MB
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export interface UploadResult {
  path: string;
  publicUrl: string;
  size: number;
}

// Upload foto ke bucket publik `gemari-photos`. Validasi tipe & ukuran
// dilakukan di server (jangan pernah percaya validasi client saja).
export async function uploadPhoto(
  file: File,
  folder: string
): Promise<UploadResult> {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    throw new Error("Format foto harus JPG, PNG, atau WebP.");
  }
  if (file.size > MAX_PHOTO_SIZE) {
    throw new Error("Ukuran foto maksimal 5MB.");
  }

  const supabase = await createClient();
  const path = `${folder}/${safeFileName(file.name)}`;

  const { error } = await supabase.storage
    .from("gemari-photos")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Gagal mengunggah foto: ${error.message}`);

  const { data } = supabase.storage.from("gemari-photos").getPublicUrl(path);
  return { path, publicUrl: data.publicUrl, size: file.size };
}

// Upload dokumen ke bucket privat `gemari-documents`. Path (bukan public
// URL) yang disimpan di kolom `file_url` — akses selalu lewat signed URL.
export async function uploadDocument(
  file: File,
  folder: string
): Promise<UploadResult> {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    throw new Error("Format dokumen harus PDF, Word, atau Excel.");
  }
  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new Error("Ukuran dokumen maksimal 20MB.");
  }

  const supabase = await createClient();
  const path = `${folder}/${safeFileName(file.name)}`;

  const { error } = await supabase.storage
    .from("gemari-documents")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Gagal mengunggah dokumen: ${error.message}`);

  return { path, publicUrl: path, size: file.size };
}

export async function deleteStorageFile(bucket: "gemari-photos" | "gemari-documents", path: string) {
  try {
    const supabase = await createClient();
    await supabase.storage.from(bucket).remove([path]);
  } catch {
    // Best-effort: jangan gagalkan operasi hapus baris database hanya
    // karena file storage gagal dihapus (mis. sudah tidak ada).
  }
}

// Mengubah public URL gemari-photos kembali menjadi path storage, supaya
// bisa dihapus saat baris terkait dihapus/diganti fotonya.
export function publicUrlToPath(url: string | null, bucketSegment: string): string | null {
  if (!url) return null;
  const marker = `/${bucketSegment}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}
