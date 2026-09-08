"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { uploadPhoto, deleteStorageFile, publicUrlToPath } from "@/lib/storage";
import { slugifyUnique } from "@/lib/slug";
import type { ActivityStatus } from "@/types/database";

function extractFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    activity_date: String(formData.get("activity_date") ?? ""),
    activity_time: String(formData.get("activity_time") ?? "") || null,
    location: String(formData.get("location") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    status: (String(formData.get("status") ?? "akan_datang") as ActivityStatus) || "akan_datang",
  };
}

export async function createActivity(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const fields = extractFields(formData);

  if (!fields.name || !fields.activity_date) {
    redirect("/dashboard/kegiatan/tambah?error=Nama dan tanggal kegiatan wajib diisi");
  }

  let photo_url: string | null = null;
  const photoFile = formData.get("photo") as File | null;
  if (photoFile && photoFile.size > 0) {
    try {
      const uploaded = await uploadPhoto(photoFile, "activities");
      photo_url = uploaded.publicUrl;
    } catch (err) {
      redirect(
        `/dashboard/kegiatan/tambah?error=${encodeURIComponent((err as Error).message)}`
      );
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.from("activities").insert({
    ...fields,
    slug: slugifyUnique(fields.name),
    photo_url,
  });

  if (error) {
    redirect(`/dashboard/kegiatan/tambah?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/kegiatan");
  revalidatePath("/kegiatan");
  revalidatePath("/");
  redirect("/dashboard/kegiatan?success=Kegiatan berhasil ditambahkan");
}

export async function updateActivity(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const id = String(formData.get("id") ?? "");
  const fields = extractFields(formData);

  if (!id || !fields.name || !fields.activity_date) {
    redirect(
      `/dashboard/kegiatan/${id}/edit?error=Nama dan tanggal kegiatan wajib diisi`
    );
  }

  const supabase = await createClient();

  let photo_url: string | undefined;
  const photoFile = formData.get("photo") as File | null;
  if (photoFile && photoFile.size > 0) {
    try {
      const uploaded = await uploadPhoto(photoFile, "activities");
      photo_url = uploaded.publicUrl;

      const oldUrl = String(formData.get("current_photo_url") ?? "");
      const oldPath = publicUrlToPath(oldUrl, "gemari-photos");
      if (oldPath) await deleteStorageFile("gemari-photos", oldPath);
    } catch (err) {
      redirect(
        `/dashboard/kegiatan/${id}/edit?error=${encodeURIComponent((err as Error).message)}`
      );
    }
  }

  const { error } = await supabase
    .from("activities")
    .update({ ...fields, ...(photo_url ? { photo_url } : {}) })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/kegiatan/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/kegiatan");
  revalidatePath("/kegiatan");
  revalidatePath("/");
  redirect("/dashboard/kegiatan?success=Kegiatan berhasil diperbarui");
}

export async function deleteActivity(id: string) {
  await requireRole(STAFF_ROLES);
  if (!id) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("activities")
    .select("photo_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("activities").delete().eq("id", id);

  if (error) {
    redirect(`/dashboard/kegiatan?error=${encodeURIComponent(error.message)}`);
  }

  const path = publicUrlToPath(
    (existing as { photo_url: string | null } | null)?.photo_url ?? null,
    "gemari-photos"
  );
  if (path) await deleteStorageFile("gemari-photos", path);

  revalidatePath("/dashboard/kegiatan");
  revalidatePath("/kegiatan");
  revalidatePath("/");
  redirect("/dashboard/kegiatan?success=Kegiatan berhasil dihapus");
}
