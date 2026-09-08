import Link from "next/link";
import { Pencil } from "lucide-react";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getTransactions, getFinanceSummary } from "@/lib/data/finance";
import { deleteTransaction } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmDeleteButton } from "@/components/dashboard/ConfirmDeleteButton";
import { FinanceSummaryCards } from "@/components/keuangan/FinanceSummaryCards";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Keuangan" };
export const dynamic = "force-dynamic";

export default async function DashboardKeuanganPage() {
  await requireRole(STAFF_ROLES);
  const [transactions, summary] = await Promise.all([
    getTransactions({ sort: "desc" }),
    getFinanceSummary(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaksi Keuangan"
        description="Kelola seluruh transaksi pemasukan dan pengeluaran GEMARI."
        addHref="/dashboard/keuangan/tambah"
        addLabel="Tambah Transaksi"
      />

      <FinanceSummaryCards summary={summary} />

      <div className="overflow-x-auto rounded-card border border-navy/10 bg-white shadow-softer">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Tanggal</th>
              <th className="px-4 py-3 font-medium">Kode</th>
              <th className="px-4 py-3 font-medium">Keterangan</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 text-right font-medium">Nominal</th>
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-navy/5 last:border-0">
                <td className="px-4 py-3 text-muted">
                  {formatDate(t.transaction_date)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">
                  {t.transaction_code}
                </td>
                <td className="px-4 py-3 text-navy">{t.description}</td>
                <td className="px-4 py-3 text-muted">{t.category}</td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    t.type === "pemasukan" ? "text-brand-green" : "text-brand-red"
                  }`}
                >
                  {t.type === "pemasukan" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/dashboard/keuangan/${t.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-brand-green-light hover:text-brand-green-dark"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <ConfirmDeleteButton
                      id={t.id}
                      action={deleteTransaction}
                      confirmMessage={`Hapus transaksi "${t.description}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {transactions.length === 0 && (
        <p className="text-sm text-muted">Belum ada transaksi keuangan.</p>
      )}
    </div>
  );
}
