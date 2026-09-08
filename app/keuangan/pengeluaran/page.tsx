import type { Metadata } from "next";
import { TrendingDown } from "lucide-react";
import { getTransactions } from "@/lib/data/finance";
import { EXPENSE_CATEGORIES } from "@/lib/finance-categories";
import { TransactionFilterForm } from "@/components/keuangan/TransactionFilterForm";
import { TransactionTable } from "@/components/keuangan/TransactionTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Pengeluaran" };
export const dynamic = "force-dynamic";

interface SearchParams {
  q?: string;
  kategori?: string;
  dari?: string;
  sampai?: string;
  sort?: string;
}

export default async function PengeluaranPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const transactions = await getTransactions({
    type: "pengeluaran",
    category: params.kategori,
    search: params.q,
    from: params.dari,
    to: params.sampai,
    sort: params.sort === "asc" ? "asc" : "desc",
  });

  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">
        Pengeluaran
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
        Rincian seluruh transaksi pengeluaran GEMARI.
      </p>

      <div className="mt-6">
        <TransactionFilterForm
          action="/keuangan/pengeluaran"
          categories={EXPENSE_CATEGORIES}
          values={params}
        />
      </div>

      <p className="mt-4 text-sm text-muted">
        Menampilkan {transactions.length} transaksi · Total{" "}
        <span className="font-semibold text-brand-red">
          {formatCurrency(total)}
        </span>
      </p>

      <div className="mt-4">
        {transactions.length === 0 ? (
          <EmptyState
            icon={TrendingDown}
            title="Tidak ada transaksi pengeluaran"
            description="Coba ubah filter, atau tunggu pencatatan transaksi baru dari pengurus."
          />
        ) : (
          <TransactionTable transactions={transactions} />
        )}
      </div>
    </div>
  );
}
