import { createClient } from "@/lib/supabase/server";
import type { FinancialTransaction, TransactionType } from "@/types/database";

export interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  search?: string;
  from?: string; // yyyy-mm-dd
  to?: string; // yyyy-mm-dd
  sort?: "asc" | "desc"; // berdasarkan tanggal, default desc
}

function applyFilters(query: any, filters: TransactionFilters) {
  let q = query;
  if (filters.type) q = q.eq("type", filters.type);
  if (filters.category) q = q.eq("category", filters.category);
  if (filters.from) q = q.gte("transaction_date", filters.from);
  if (filters.to) q = q.lte("transaction_date", filters.to);
  if (filters.search) {
    q = q.or(
      `description.ilike.%${filters.search}%,transaction_code.ilike.%${filters.search}%`
    );
  }
  return q;
}

// Data transaksi keuangan bersifat publik untuk transparansi organisasi
// (lihat kebijakan RLS `financial_public_read`) — halaman ini boleh diakses
// tanpa login. Hanya operasi tulis (tambah/edit/hapus) yang dibatasi
// pengurus/admin lewat dashboard.
export async function getTransactions(
  filters: TransactionFilters = {}
): Promise<FinancialTransaction[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from("financial_transactions").select("*");
    query = applyFilters(query, filters);
    query = query.order("transaction_date", {
      ascending: filters.sort === "asc",
    });

    const { data } = await query;
    return (data as FinancialTransaction[]) ?? [];
  } catch {
    return [];
  }
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export async function getFinanceSummary(
  filters: TransactionFilters = {}
): Promise<FinanceSummary> {
  try {
    const supabase = await createClient();
    let query = supabase.from("financial_transactions").select("type, amount");
    query = applyFilters(query, filters);

    const { data } = await query;
    const rows = (data as { type: TransactionType; amount: number }[]) ?? [];

    const totalIncome = rows
      .filter((r) => r.type === "pemasukan")
      .reduce((sum, r) => sum + Number(r.amount), 0);
    const totalExpense = rows
      .filter((r) => r.type === "pengeluaran")
      .reduce((sum, r) => sum + Number(r.amount), 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  } catch {
    return { totalIncome: 0, totalExpense: 0, balance: 0 };
  }
}

export interface MonthlyChartPoint {
  month: string; // label singkat, mis. "Jan 2026"
  pemasukan: number;
  pengeluaran: number;
}

// Agregat 6 bulan terakhir (termasuk bulan berjalan) untuk grafik dashboard.
export async function getMonthlyChartData(): Promise<MonthlyChartPoint[]> {
  try {
    const supabase = await createClient();

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const startStr = start.toISOString().slice(0, 10);

    const { data } = await supabase
      .from("financial_transactions")
      .select("transaction_date, type, amount")
      .gte("transaction_date", startStr);

    const rows =
      (data as {
        transaction_date: string;
        type: TransactionType;
        amount: number;
      }[]) ?? [];

    const monthLabels = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];

    const buckets = new Map<string, MonthlyChartPoint>();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      buckets.set(key, {
        month: `${monthLabels[d.getMonth()]} ${d.getFullYear()}`,
        pemasukan: 0,
        pengeluaran: 0,
      });
    }

    for (const r of rows) {
      const key = r.transaction_date.slice(0, 7);
      const bucket = buckets.get(key);
      if (!bucket) continue;
      if (r.type === "pemasukan") bucket.pemasukan += Number(r.amount);
      else bucket.pengeluaran += Number(r.amount);
    }

    return Array.from(buckets.values());
  } catch {
    return [];
  }
}

export async function getTransactionById(
  id: string
): Promise<FinancialTransaction | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("financial_transactions")
      .select("*")
      .eq("id", id)
      .single();
    return (data ?? null) as FinancialTransaction | null;
  } catch {
    return null;
  }
}
