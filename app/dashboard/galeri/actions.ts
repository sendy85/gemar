"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { uploadPhoto, deleteStorageFile, publicUrlToPath } from "@/lib/storage";

function extractFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    photo_date: String(formData.get("photo_date") ?? ""),
    description: String(formData.get("description") ?? "").trim() || null,
    activity_id: String(formData.get("activity_id") ?? "") || null,
  };
}

export async function createGalleryItem(formData: FormData) {
  const actor = await requireRole(STAFF_ROLES);
  const fields = extractFields(formData);

  if (!fields.title || !fields.photo_date) {
    redirect("/dashboard/galeri/tambah?error=Judul dan tanggal foto wajib diisi");
  }

  const photoFile = formData.get("photo") as File | null;
  if (!photoFile || photoFile.size === 0) {
    redirect("/dashboard/galeri/tambah?error=Foto wajib diunggah");
  }

  let photo_url: string;
  try {
    const uploaded = await uploadPhoto(photoFile, "gallery");
    photo_url = uploaded.publicUrl;
  } catch (err) {
    redirect(
      `/dashboard/galeri/tambah?error=${encodeURIComponent((err as Error).message)}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("gallery").insert({
    ...fields,
    photo_url,
    created_by: actor.id,
  });

  if (error) {
    redirect(`/dashboard/galeri/tambah?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/galeri");
  revalidatePath("/galeri");
  revalidatePath("/");
  redirect("/dashboard/galeri?success=Foto berhasil ditambahkan");
}

export async function updateGalleryItem(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const id = String(formData.get("id") ?? "");
  const fields = extractFields(formData);

  if (!id || !fields.title || !fields.photo_date) {
    redirect(`/dashboard/galeri/${id}/edit?error=Judul dan tanggal foto wajib diisi`);
  }

  const supabase = await createClient();

  let photo_url: string | undefined;
  const photoFile = formData.get("photo") as File | null;
  if (photoFile && photoFile.size > 0) {
    try {
      const uploaded = await uploadPhoto(photoFile, "gallery");
      photo_url = uploaded.publicUrl;

      const oldUrl = String(formData.get("current_photo_url") ?? "");
      const oldPath = publicUrlToPath(oldUrl, "gemari-photos");
      if (oldPath) await deleteStorageFile("gemari-photos", oldPath);
    } catch (err) {
      redirect(
        `/dashboard/galeri/${id}/edit?error=${encodeURIComponent((err as Error).message)}`
      );
    }
  }

  const { error } = await supabase
    .from("gallery")
    .update({ ...fields, ...(photo_url ? { photo_url } : {}) })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/galeri/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/galeri");
  revalidatePath("/galeri");
  revalidatePath("/");
  redirect("/dashboard/galeri?success=Foto berhasil diperbarui");
}

export async function deleteGalleryItem(id: string) {
  await requireRole(STAFF_ROLES);
  if (!id) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("gallery")
    .select("photo_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("gallery").delete().eq("id", id);

  if (error) {
    redirect(`/dashboard/galeri?error=${encodeURIComponent(error.message)}`);
  }

  const path = publicUrlToPath(
    (existing as { photo_url: string | null } | null)?.photo_url ?? null,
    "gemari-photos"
  );
  if (path) await deleteStorageFile("gemari-photos", path);

  revalidatePath("/dashboard/galeri");
  revalidatePath("/galeri");
  revalidatePath("/");
  redirect("/dashboard/galeri?success=Foto berhasil dihapus");
}
