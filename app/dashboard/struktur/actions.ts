"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function extractFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    board_member_id: String(formData.get("board_member_id") ?? "") || null,
    parent_id: String(formData.get("parent_id") ?? "") || null,
    order_index: formData.get("order_index")
      ? Number(formData.get("order_index"))
      : 0,
  };
}

export async function createStructureNode(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const fields = extractFields(formData);

  if (!fields.title) {
    redirect("/dashboard/struktur/tambah?error=Judul jabatan wajib diisi");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("org_structure").insert(fields);

  if (error) {
    redirect(`/dashboard/struktur/tambah?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/struktur");
  revalidatePath("/profil/struktur");
  redirect("/dashboard/struktur?success=Struktur berhasil ditambahkan");
}

export async function updateStructureNode(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const id = String(formData.get("id") ?? "");
  const fields = extractFields(formData);

  if (!id || !fields.title) {
    redirect(`/dashboard/struktur/${id}/edit?error=Judul jabatan wajib diisi`);
  }

  if (fields.parent_id === id) {
    redirect(
      `/dashboard/struktur/${id}/edit?error=Node tidak bisa menjadi induk dirinya sendiri`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("org_structure")
    .update(fields)
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/struktur/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/struktur");
  revalidatePath("/profil/struktur");
  redirect("/dashboard/struktur?success=Struktur berhasil diperbarui");
}

export async function deleteStructureNode(id: string) {
  await requireRole(STAFF_ROLES);
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("org_structure").delete().eq("id", id);

  if (error) {
    redirect(`/dashboard/struktur?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/struktur");
  revalidatePath("/profil/struktur");
  redirect("/dashboard/struktur?success=Struktur berhasil dihapus");
}
