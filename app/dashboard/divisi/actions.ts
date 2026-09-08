"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function extractFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    head_name: String(formData.get("head_name") ?? "").trim() || null,
  };
}

export async function createDivision(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const fields = extractFields(formData);

  if (!fields.name) {
    redirect("/dashboard/divisi/tambah?error=Nama divisi wajib diisi");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("divisions").insert(fields);

  if (error) {
    redirect(`/dashboard/divisi/tambah?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/divisi");
  revalidatePath("/organisasi/divisi");
  redirect("/dashboard/divisi?success=Divisi berhasil ditambahkan");
}

export async function updateDivision(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const id = String(formData.get("id") ?? "");
  const fields = extractFields(formData);

  if (!id || !fields.name) {
    redirect(`/dashboard/divisi/${id}/edit?error=Nama divisi wajib diisi`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("divisions").update(fields).eq("id", id);

  if (error) {
    redirect(`/dashboard/divisi/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/divisi");
  revalidatePath("/organisasi/divisi");
  redirect("/dashboard/divisi?success=Divisi berhasil diperbarui");
}

export async function deleteDivision(id: string) {
  await requireRole(STAFF_ROLES);
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("divisions").delete().eq("id", id);

  if (error) {
    redirect(`/dashboard/divisi?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/divisi");
  revalidatePath("/organisasi/divisi");
  redirect("/dashboard/divisi?success=Divisi berhasil dihapus");
}
