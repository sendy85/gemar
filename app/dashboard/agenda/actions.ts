"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { AgendaStatus } from "@/types/database";

function extractFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    agenda_date: String(formData.get("agenda_date") ?? ""),
    agenda_time: String(formData.get("agenda_time") ?? "") || null,
    location: String(formData.get("location") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    status: (String(formData.get("status") ?? "akan_datang") as AgendaStatus) || "akan_datang",
  };
}

export async function createAgenda(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const fields = extractFields(formData);

  if (!fields.title || !fields.agenda_date) {
    redirect("/dashboard/agenda/tambah?error=Judul dan tanggal agenda wajib diisi");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("agendas").insert(fields);

  if (error) {
    redirect(`/dashboard/agenda/tambah?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/agenda");
  revalidatePath("/agenda");
  revalidatePath("/");
  redirect("/dashboard/agenda?success=Agenda berhasil ditambahkan");
}

export async function updateAgenda(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const id = String(formData.get("id") ?? "");
  const fields = extractFields(formData);

  if (!id || !fields.title || !fields.agenda_date) {
    redirect(`/dashboard/agenda/${id}/edit?error=Judul dan tanggal agenda wajib diisi`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("agendas").update(fields).eq("id", id);

  if (error) {
    redirect(`/dashboard/agenda/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/agenda");
  revalidatePath("/agenda");
  revalidatePath("/");
  redirect("/dashboard/agenda?success=Agenda berhasil diperbarui");
}

export async function deleteAgenda(id: string) {
  await requireRole(STAFF_ROLES);
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("agendas").delete().eq("id", id);

  if (error) {
    redirect(`/dashboard/agenda?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/agenda");
  revalidatePath("/agenda");
  revalidatePath("/");
  redirect("/dashboard/agenda?success=Agenda berhasil dihapus");
}
