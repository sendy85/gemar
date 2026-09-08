"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { uploadPhoto, deleteStorageFile, publicUrlToPath } from "@/lib/storage";

function extractFields(formData: FormData) {
  return {
    full_name: String(formData.get("full_name") ?? "").trim(),
    position_title: String(formData.get("position_title") ?? "").trim(),
    division_id: String(formData.get("division_id") ?? "") || null,
    period: String(formData.get("period") ?? "").trim(),
    order_index: formData.get("order_index")
      ? Number(formData.get("order_index"))
      : 0,
  };
}

export async function createBoardMember(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const fields = extractFields(formData);

  if (!fields.full_name || !fields.position_title || !fields.period) {
    redirect(
      "/dashboard/pengurus/tambah?error=Nama, jabatan, dan periode wajib diisi"
    );
  }

  let photo_url: string | null = null;
  const photoFile = formData.get("photo") as File | null;
  if (photoFile && photoFile.size > 0) {
    try {
      const uploaded = await uploadPhoto(photoFile, "board-members");
      photo_url = uploaded.publicUrl;
    } catch (err) {
      redirect(
        `/dashboard/pengurus/tambah?error=${encodeURIComponent((err as Error).message)}`
      );
    }
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("board_members")
    .insert({ ...fields, photo_url });

  if (error) {
    redirect(`/dashboard/pengurus/tambah?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/pengurus");
  revalidatePath("/organisasi/pengurus");
  revalidatePath("/dashboard/struktur");
  redirect("/dashboard/pengurus?success=Pengurus berhasil ditambahkan");
}

export async function updateBoardMember(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const id = String(formData.get("id") ?? "");
  const fields = extractFields(formData);

  if (!id || !fields.full_name || !fields.position_title || !fields.period) {
    redirect(
      `/dashboard/pengurus/${id}/edit?error=Nama, jabatan, dan periode wajib diisi`
    );
  }

  const supabase = await createClient();

  let photo_url: string | undefined;
  const photoFile = formData.get("photo") as File | null;
  if (photoFile && photoFile.size > 0) {
    try {
      const uploaded = await uploadPhoto(photoFile, "board-members");
      photo_url = uploaded.publicUrl;

      const oldUrl = String(formData.get("current_photo_url") ?? "");
      const oldPath = publicUrlToPath(oldUrl, "gemari-photos");
      if (oldPath) await deleteStorageFile("gemari-photos", oldPath);
    } catch (err) {
      redirect(
        `/dashboard/pengurus/${id}/edit?error=${encodeURIComponent((err as Error).message)}`
      );
    }
  }

  const { error } = await supabase
    .from("board_members")
    .update({ ...fields, ...(photo_url ? { photo_url } : {}) })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/pengurus/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/pengurus");
  revalidatePath("/organisasi/pengurus");
  revalidatePath("/dashboard/struktur");
  redirect("/dashboard/pengurus?success=Pengurus berhasil diperbarui");
}

export async function deleteBoardMember(id: string) {
  await requireRole(STAFF_ROLES);
  if (!id) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("board_members")
    .select("photo_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("board_members").delete().eq("id", id);

  if (error) {
    redirect(`/dashboard/pengurus?error=${encodeURIComponent(error.message)}`);
  }

  const path = publicUrlToPath(
    (existing as { photo_url: string | null } | null)?.photo_url ?? null,
    "gemari-photos"
  );
  if (path) await deleteStorageFile("gemari-photos", path);

  revalidatePath("/dashboard/pengurus");
  revalidatePath("/organisasi/pengurus");
  revalidatePath("/dashboard/struktur");
  redirect("/dashboard/pengurus?success=Pengurus berhasil dihapus");
}
