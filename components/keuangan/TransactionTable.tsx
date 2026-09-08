import { formatCurrency, formatDate } from "@/lib/utils";
import type { FinancialTransaction } from "@/types/database";

export interface TransactionRow extends FinancialTransaction {
  runningBalance?: number;
}

// Menghitung saldo berjalan berdasarkan urutan tanggal transaksi (menaik),
// lalu memetakan kembali ke urutan tampilan asli. Saldo dihitung mulai dari
// 0 untuk kumpulan transaksi yang sedang difilter (bukan saldo global),
// sesuai konteks laporan per periode.
export function withRunningBalance(
  transactions: FinancialTransaction[]
): TransactionRow[] {
  const sorted = [...transactions].sort((a, b) => {
    const byDate = a.transaction_date.localeCompare(b.transaction_date);
    if (byDate !== 0) return byDate;
    return a.created_at.localeCompare(b.created_at);
  });

  const balanceMap = new Map<string, number>();
  let running = 0;
  for (const t of sorted) {
    running += t.type === "pemasukan" ? Number(t.amount) : -Number(t.amount);
    balanceMap.set(t.id, running);
  }

  return transactions.map((t) => ({ ...t, runningBalance: balanceMap.get(t.id) }));
}

export function TransactionTable({
  transactions,
  showBalance = false,
}: {
  transactions: TransactionRow[];
  showBalance?: boolean;
}) {
  return (
    <div className="rounded-card border border-navy/10 bg-white shadow-softer">
      {/* Desktop: tabel dengan horizontal scroll bila perlu */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">No</th>
              <th className="px-4 py-3 font-medium">Tanggal</th>
              <th className="px-4 py-3 font-medium">Kode</th>
              <th className="px-4 py-3 font-medium">Keterangan</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 text-right font-medium">Pemasukan</th>
              <th className="px-4 py-3 text-right font-medium">Pengeluaran</th>
              {showBalance && (
                <th className="px-4 py-3 text-right font-medium">Saldo</th>
              )}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr
                key={t.id}
                className="border-b border-navy/5 last:border-0 hover:bg-brand-green-light/30"
              >
                <td className="px-4 py-3 text-muted">{i + 1}</td>
                <td className="px-4 py-3 text-navy">
                  {formatDate(t.transaction_date)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">
                  {t.transaction_code}
                </td>
                <td className="px-4 py-3 text-navy">{t.description}</td>
                <td className="px-4 py-3 text-muted">{t.category}</td>
                <td className="px-4 py-3 text-right font-medium text-brand-green">
                  {t.type === "pemasukan" ? formatCurrency(t.amount) : "-"}
                </td>
                <td className="px-4 py-3 text-right font-medium text-brand-red">
                  {t.type === "pengeluaran" ? formatCurrency(t.amount) : "-"}
                </td>
                {showBalance && (
                  <td className="px-4 py-3 text-right font-semibold text-navy">
                    {formatCurrency(t.runningBalance ?? 0)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card list */}
      <div className="divide-y divide-navy/5 md:hidden">
        {transactions.map((t, i) => (
          <div key={t.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted">
                  #{i + 1} · {formatDate(t.transaction_date)}
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-navy">
                  {t.description}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {t.category} · {t.transaction_code}
                </p>
              </div>
              <p
                className={`shrink-0 text-sm font-semibold ${
                  t.type === "pemasukan" ? "text-brand-green" : "text-brand-red"
                }`}
              >
                {t.type === "pemasukan" ? "+" : "-"}
                {formatCurrency(t.amount)}
              </p>
            </div>
            {showBalance && (
              <p className="mt-2 text-xs text-muted">
                Saldo:{" "}
                <span className="font-medium text-navy">
                  {formatCurrency(t.runningBalance ?? 0)}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
