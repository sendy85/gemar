import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { FinanceSummary } from "@/lib/data/finance";

export function FinanceSummaryCards({ summary }: { summary: FinanceSummary }) {
  const items = [
    {
      label: "Total Pemasukan",
      value: summary.totalIncome,
      icon: TrendingUp,
      accent: "text-brand-green bg-brand-green-light",
    },
    {
      label: "Total Pengeluaran",
      value: summary.totalExpense,
      icon: TrendingDown,
      accent: "text-brand-red bg-brand-red/10",
    },
    {
      label: "Saldo",
      value: summary.balance,
      icon: Wallet,
      accent: "text-brand-blue bg-brand-blue/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ label, value, icon: Icon, accent }) => (
        <div
          key={label}
          className="rounded-card border border-navy/10 bg-white p-5 shadow-softer"
        >
          <div className={`inline-flex rounded-lg p-2 ${accent}`}>
            <Icon size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-navy sm:text-2xl">
            {formatCurrency(value)}
          </p>
          <p className="text-sm text-muted">{label}</p>
        </div>
      ))}
    </div>
  );
}
