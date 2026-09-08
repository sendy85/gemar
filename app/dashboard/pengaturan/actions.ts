"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, ADMIN_ONLY } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

const VALID_ROLES: UserRole[] = ["admin", "pengurus", "anggota"];

export async function updateUserRole(formData: FormData) {
  const actor = await requireRole(ADMIN_ONLY);

  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!userId || !VALID_ROLES.includes(role as UserRole)) {
    redirect("/dashboard/pengaturan?error=Data tidak valid");
  }

  if (userId === actor.id && role !== "admin") {
    redirect(
      "/dashboard/pengaturan?error=Tidak bisa menurunkan role akun sendiri"
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: role as UserRole })
    .eq("id", userId);

  if (error) {
    redirect(`/dashboard/pengaturan?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/pengaturan");
  redirect("/dashboard/pengaturan?success=Role berhasil diperbarui");
}
