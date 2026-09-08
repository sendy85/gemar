"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { TransactionType } from "@/types/database";

function extractFields(formData: FormData) {
  return {
    transaction_date: String(formData.get("transaction_date") ?? ""),
    description: String(formData.get("description") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    type: String(formData.get("type") ?? "pemasukan") as TransactionType,
    amount: Number(formData.get("amount") ?? 0),
  };
}

// Kode transaksi otomatis: PMK/PGL-YYYYMMDD-XXXX (4 karakter acak) supaya
// pengurus tidak perlu memikirkan penomoran manual dan tetap unik.
function generateTransactionCode(type: TransactionType, date: string) {
  const prefix = type === "pemasukan" ? "PMK" : "PGL";
  const datePart = date.replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${datePart}-${random}`;
}

export async function createTransaction(formData: FormData) {
  const actor = await requireRole(STAFF_ROLES);
  const fields = extractFields(formData);

  if (!fields.transaction_date || !fields.description || !fields.category || !fields.amount) {
    redirect("/dashboard/keuangan/tambah?error=Semua field wajib diisi dengan benar");
  }
  if (fields.amount <= 0) {
    redirect("/dashboard/keuangan/tambah?error=Nominal harus lebih dari 0");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("financial_transactions").insert({
    ...fields,
    transaction_code: generateTransactionCode(fields.type, fields.transaction_date),
    created_by: actor.id,
  });

  if (error) {
    redirect(`/dashboard/keuangan/tambah?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/keuangan");
  revalidatePath("/keuangan");
  revalidatePath("/keuangan/pemasukan");
  revalidatePath("/keuangan/pengeluaran");
  revalidatePath("/keuangan/laporan");
  revalidatePath("/");
  redirect("/dashboard/keuangan?success=Transaksi berhasil ditambahkan");
}

export async function updateTransaction(formData: FormData) {
  await requireRole(STAFF_ROLES);
  const id = String(formData.get("id") ?? "");
  const fields = extractFields(formData);

  if (!id || !fields.transaction_date || !fields.description || !fields.category || !fields.amount) {
    redirect(`/dashboard/keuangan/${id}/edit?error=Semua field wajib diisi dengan benar`);
  }
  if (fields.amount <= 0) {
    redirect(`/dashboard/keuangan/${id}/edit?error=Nominal harus lebih dari 0`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("financial_transactions")
    .update(fields)
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/keuangan/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/keuangan");
  revalidatePath("/keuangan");
  revalidatePath("/keuangan/pemasukan");
  revalidatePath("/keuangan/pengeluaran");
  revalidatePath("/keuangan/laporan");
  revalidatePath("/");
  redirect("/dashboard/keuangan?success=Transaksi berhasil diperbarui");
}

export async function deleteTransaction(id: string) {
  await requireRole(STAFF_ROLES);
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("financial_transactions")
    .delete()
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/keuangan?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/keuangan");
  revalidatePath("/keuangan");
  revalidatePath("/keuangan/pemasukan");
  revalidatePath("/keuangan/pengeluaran");
  revalidatePath("/keuangan/laporan");
  revalidatePath("/");
  redirect("/dashboard/keuangan?success=Transaksi berhasil dihapus");
}
