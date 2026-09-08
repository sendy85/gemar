// Kategori transaksi ini bukan enum database (kolom `category` bertipe
// text agar fleksibel) — daftar ini hanya dipakai untuk mengisi pilihan
// filter & form di UI, sesuai contoh pada dokumen requirement.

export const INCOME_CATEGORIES = [
  "Iuran",
  "Donasi",
  "Sponsor",
  "Bantuan",
  "Lainnya",
] as const;

export const EXPENSE_CATEGORIES = [
  "Konsumsi",
  "Peralatan",
  "Kegiatan",
  "Transportasi",
  "Administrasi",
  "Lainnya",
] as const;

export function categoriesForType(type: "pemasukan" | "pengeluaran") {
  return type === "pemasukan" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
