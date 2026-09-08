import type { Metadata } from "next";
import { FileBarChart } from "lucide-react";
import { getTransactions } from "@/lib/data/finance";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/finance-categories";
import { TransactionFilterForm } from "@/components/keuangan/TransactionFilterForm";
import { TransactionTable, withRunningBalance } from "@/components/keuangan/TransactionTable";
import { FinanceSummaryCards } from "@/components/keuangan/FinanceSummaryCards";
import { ExportButtons } from "@/components/keuangan/ExportButtons";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import type { TransactionType } from "@/types/database";

export const metadata: Metadata = { title: "Laporan Keuangan" };
export const dynamic = "force-dynamic";

interface SearchParams {
  q?: string;
  kategori?: string;
  dari?: string;
  sampai?: string;
  sort?: string;
  jenis?: string;
}

const ALL_CATEGORIES = Array.from(
  new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])
);

function buildPeriode(dari?: string, sampai?: string) {
  if (dari && sampai) {
    return {
      label: `${formatDate(dari)} - ${formatDate(sampai)}`,
      slug: `${dari}_sd_${sampai}`,
    };
  }
  if (dari) {
    return { label: `Sejak ${formatDate(dari)}`, slug: `sejak_${dari}` };
  }
  if (sampai) {
    return { label: `Sampai ${formatDate(sampai)}`, slug: `sampai_${sampai}` };
  }
  return { label: "Seluruh Periode", slug: "seluruh-periode" };
}

export default async function LaporanKeuanganPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const type =
    params.jenis === "pemasukan" || params.jenis === "pengeluaran"
      ? (params.jenis as TransactionType)
      : undefined;

  const transactions = await getTransactions({
    type,
    category: params.kategori,
    search: params.q,
    from: params.dari,
    to: params.sampai,
    sort: params.sort === "asc" ? "asc" : "desc",
  });

  const rows = withRunningBalance(transactions);
  const totalIncome = transactions
    .filter((t) => t.type === "pemasukan")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "pengeluaran")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const periode = buildPeriode(params.dari, params.sampai);

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">
            Laporan Keuangan
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
            Filter berdasarkan tanggal, jenis, dan kategori transaksi, lalu
            unduh laporannya dalam format Excel atau PDF.
          </p>
        </div>
        <ExportButtons
          transactions={rows}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
          periodeLabel={periode.label}
          periodeSlug={periode.slug}
        />
      </div>

      <div className="mt-6">
        <TransactionFilterForm
          action="/keuangan/laporan"
          categories={ALL_CATEGORIES}
          values={params}
          showTypeFilter
        />
      </div>

      <div className="mt-6">
        <FinanceSummaryCards
          summary={{ totalIncome, totalExpense, balance }}
        />
      </div>

      <p className="mt-4 text-sm text-muted">
        Periode: <span className="font-medium text-navy">{periode.label}</span>{" "}
        · {transactions.length} transaksi
      </p>

      <div className="mt-4">
        {rows.length === 0 ? (
          <EmptyState
            icon={FileBarChart}
            title="Tidak ada transaksi pada filter ini"
            description="Coba ubah rentang tanggal, jenis, atau kategori transaksi."
          />
        ) : (
          <TransactionTable transactions={rows} showBalance />
        )}
      </div>
    </div>
  );
}
