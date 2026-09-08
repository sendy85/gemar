import type { Metadata } from "next";
import { getFinanceSummary, getMonthlyChartData, getTransactions } from "@/lib/data/finance";
import { FinanceSummaryCards } from "@/components/keuangan/FinanceSummaryCards";
import { FinanceCharts } from "@/components/keuangan/FinanceCharts";
import { TransactionTable, withRunningBalance } from "@/components/keuangan/TransactionTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Wallet } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard Keuangan" };
export const dynamic = "force-dynamic";

export default async function KeuanganDashboardPage() {
  const [summary, monthly, recent] = await Promise.all([
    getFinanceSummary(),
    getMonthlyChartData(),
    getTransactions({ sort: "desc" }),
  ]);

  const recentFive = withRunningBalance(recent).slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">
        Dashboard Keuangan
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
        Ringkasan kondisi keuangan GEMARI secara transparan untuk seluruh
        anggota dan masyarakat.
      </p>

      <div className="mt-6">
        <FinanceSummaryCards summary={summary} />
      </div>

      <div className="mt-6">
        <FinanceCharts data={monthly} />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-navy">Transaksi Terbaru</h2>
        <div className="mt-4">
          {recentFive.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="Belum ada transaksi"
              description="Transaksi keuangan yang dicatat pengurus akan tampil di sini."
            />
          ) : (
            <TransactionTable transactions={recentFive} />
          )}
        </div>
      </div>
    </div>
  );
}
