"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { uploadPhoto, deleteStorageFile, publicUrlToPath } from "@/lib/storage";
import type { GenderType, MemberStatus } from "@/types/database";

function extractFields(formData: FormData) {
  return {
    full_name: String(formData.get("full_name") ?? "").trim(),
    gender: (String(formData.get("gender") ?? "") || null) as GenderType | null,
    birth_date: String(formData.get("birth_date") ?? "") || null,
    address: String(formData.get("address") ?? "").trim() || null,
    phone_number: String(formData.get("phone_number") ?? "").trim() || null,
    division_id: String(formData.get("division_id") ?? "") || null,
    status: (String(formData.get("status") ?? "aktif") as MemberStatus) || "aktif",
    join_year: formData.get("join_year")
      ? Number(formData.get("join_year"))
      : null,
  };
}

export async function createMember(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const fields = extractFields(formData);

  if (!fields.full_name) {
    redirect("/dashboard/anggota/tambah?error=Nama anggota wajib diisi");
  }

  let photo_url: string | null = null;
  const photoFile = formData.get("photo") as File | null;
  if (photoFile && photoFile.size > 0) {
    try {
      const uploaded = await uploadPhoto(photoFile, "members");
      photo_url = uploaded.publicUrl;
    } catch (err) {
      redirect(
        `/dashboard/anggota/tambah?error=${encodeURIComponent((err as Error).message)}`
      );
    }
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("members")
    .insert({ ...fields, photo_url });

  if (error) {
    redirect(`/dashboard/anggota/tambah?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/anggota");
  revalidatePath("/organisasi/anggota");
  revalidatePath("/");
  redirect("/dashboard/anggota?success=Anggota berhasil ditambahkan");
}

export async function updateMember(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const id = String(formData.get("id") ?? "");
  const fields = extractFields(formData);

  if (!id || !fields.full_name) {
    redirect(`/dashboard/anggota/${id}/edit?error=Nama anggota wajib diisi`);
  }

  const supabase = await createClient();

  let photo_url: string | undefined;
  const photoFile = formData.get("photo") as File | null;
  if (photoFile && photoFile.size > 0) {
    try {
      const uploaded = await uploadPhoto(photoFile, "members");
      photo_url = uploaded.publicUrl;

      const oldUrl = String(formData.get("current_photo_url") ?? "");
      const oldPath = publicUrlToPath(oldUrl, "gemari-photos");
      if (oldPath) await deleteStorageFile("gemari-photos", oldPath);
    } catch (err) {
      redirect(
        `/dashboard/anggota/${id}/edit?error=${encodeURIComponent((err as Error).message)}`
      );
    }
  }

  const { error } = await supabase
    .from("members")
    .update({ ...fields, ...(photo_url ? { photo_url } : {}) })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/anggota/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/anggota");
  revalidatePath("/organisasi/anggota");
  revalidatePath("/");
  redirect("/dashboard/anggota?success=Anggota berhasil diperbarui");
}

export async function deleteMember(id: string) {
  await requireRole(STAFF_ROLES);
  if (!id) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("members")
    .select("photo_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) {
    redirect(`/dashboard/anggota?error=${encodeURIComponent(error.message)}`);
  }

  const path = publicUrlToPath(
    (existing as { photo_url: string | null } | null)?.photo_url ?? null,
    "gemari-photos"
  );
  if (path) await deleteStorageFile("gemari-photos", path);

  revalidatePath("/dashboard/anggota");
  revalidatePath("/organisasi/anggota");
  revalidatePath("/");
  redirect("/dashboard/anggota?success=Anggota berhasil dihapus");
}
