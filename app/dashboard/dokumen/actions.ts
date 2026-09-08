"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { uploadDocument, deleteStorageFile } from "@/lib/storage";
import type { DocumentCategory } from "@/types/database";

export async function createDocumentAction(formData: FormData) {
  const actor = await requireRole(STAFF_ROLES);

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "") as DocumentCategory;
  const is_public = formData.get("is_public") === "on";
  const file = formData.get("file") as File | null;

  if (!name || !category) {
    redirect("/dashboard/dokumen/tambah?error=Nama dan kategori wajib diisi");
  }
  if (!file || file.size === 0) {
    redirect("/dashboard/dokumen/tambah?error=File dokumen wajib diunggah");
  }

  let uploaded;
  try {
    uploaded = await uploadDocument(file, category);
  } catch (err) {
    redirect(
      `/dashboard/dokumen/tambah?error=${encodeURIComponent((err as Error).message)}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("documents").insert({
    name,
    category,
    is_public,
    file_url: uploaded.path,
    file_size: uploaded.size,
    uploaded_by: actor.id,
  });

  if (error) {
    await deleteStorageFile("gemari-documents", uploaded.path);
    redirect(`/dashboard/dokumen/tambah?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/dokumen");
  revalidatePath("/dokumen");
  revalidatePath("/");
  redirect("/dashboard/dokumen?success=Dokumen berhasil diunggah");
}

// Hanya metadata yang bisa diubah (nama, kategori, visibilitas). Untuk
// mengganti isi file, hapus dokumen lama lalu unggah yang baru — ini
// menghindari file storage yatim/tidak konsisten dengan baris database.
export async function updateDocumentMeta(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "") as DocumentCategory;
  const is_public = formData.get("is_public") === "on";

  if (!id || !name || !category) {
    redirect(`/dashboard/dokumen/${id}/edit?error=Nama dan kategori wajib diisi`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("documents")
    .update({ name, category, is_public })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/dokumen/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/dokumen");
  revalidatePath("/dokumen");
  redirect("/dashboard/dokumen?success=Dokumen berhasil diperbarui");
}

export async function deleteDocumentAction(id: string) {
  await requireRole(STAFF_ROLES);
  if (!id) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("documents")
    .select("file_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) {
    redirect(`/dashboard/dokumen?error=${encodeURIComponent(error.message)}`);
  }

  const path = (existing as { file_url: string } | null)?.file_url;
  if (path) await deleteStorageFile("gemari-documents", path);

  revalidatePath("/dashboard/dokumen");
  revalidatePath("/dokumen");
  revalidatePath("/");
  redirect("/dashboard/dokumen?success=Dokumen berhasil dihapus");
}
