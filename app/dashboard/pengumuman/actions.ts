"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { slugifyUnique } from "@/lib/slug";

function extractFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    announcement_date: String(formData.get("announcement_date") ?? ""),
    author: String(formData.get("author") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
  };
}

export async function createAnnouncement(formData: FormData) {
  const actor = await requireRole(STAFF_ROLES);
  const fields = extractFields(formData);

  if (!fields.title || !fields.content || !fields.announcement_date) {
    redirect(
      "/dashboard/pengumuman/tambah?error=Judul, isi, dan tanggal wajib diisi"
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("announcements").insert({
    ...fields,
    author: fields.author || actor.full_name,
    slug: slugifyUnique(fields.title),
    created_by: actor.id,
  });

  if (error) {
    redirect(`/dashboard/pengumuman/tambah?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/pengumuman");
  revalidatePath("/pengumuman");
  revalidatePath("/");
  redirect("/dashboard/pengumuman?success=Pengumuman berhasil ditambahkan");
}

export async function updateAnnouncement(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const id = String(formData.get("id") ?? "");
  const fields = extractFields(formData);

  if (!id || !fields.title || !fields.content || !fields.announcement_date) {
    redirect(
      `/dashboard/pengumuman/${id}/edit?error=Judul, isi, dan tanggal wajib diisi`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("announcements")
    .update(fields)
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/pengumuman/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/pengumuman");
  revalidatePath("/pengumuman");
  revalidatePath("/");
  redirect("/dashboard/pengumuman?success=Pengumuman berhasil diperbarui");
}

export async function deleteAnnouncement(id: string) {
  await requireRole(STAFF_ROLES);
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) {
    redirect(`/dashboard/pengumuman?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/pengumuman");
  revalidatePath("/pengumuman");
  revalidatePath("/");
  redirect("/dashboard/pengumuman?success=Pengumuman berhasil dihapus");
}
