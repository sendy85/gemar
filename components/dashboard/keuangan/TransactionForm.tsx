"use client";

import { useState } from "react";
import {
  FormField,
  FormError,
  FormActions,
  fieldInputClass,
} from "@/components/dashboard/FormField";
import { categoriesForType } from "@/lib/finance-categories";
import type { FinancialTransaction, TransactionType } from "@/types/database";

export function TransactionForm({
  action,
  transaction,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  transaction?: FinancialTransaction;
  error?: string;
}) {
  const [type, setType] = useState<TransactionType>(
    transaction?.type ?? "pemasukan"
  );
  const categories = categoriesForType(type);

  return (
    <form
      action={action}
      className="space-y-5 rounded-card border border-navy/10 bg-white p-6 shadow-softer"
    >
      {transaction && <input type="hidden" name="id" value={transaction.id} />}
      <FormError message={error} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Jenis Transaksi" htmlFor="type" required>
          <select
            id="type"
            name="type"
            required
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            className={fieldInputClass}
          >
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
        </FormField>

        <FormField label="Kategori" htmlFor="category" required>
          <select
            id="category"
            name="category"
            required
            defaultValue={transaction?.category ?? ""}
            className={fieldInputClass}
          >
            <option value="" disabled>
              Pilih kategori
            </option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Tanggal" htmlFor="transaction_date" required>
          <input
            id="transaction_date"
            name="transaction_date"
            type="date"
            required
            defaultValue={transaction?.transaction_date}
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Nominal (Rp)" htmlFor="amount" required>
          <input
            id="amount"
            name="amount"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={transaction?.amount}
            className={fieldInputClass}
            placeholder="100000"
          />
        </FormField>
      </div>

      <FormField label="Keterangan" htmlFor="description" required>
        <textarea
          id="description"
          name="description"
          rows={3}
          required
          defaultValue={transaction?.description}
          className={fieldInputClass}
          placeholder="mis. Iuran anggota bulan September"
        />
      </FormField>

      {transaction && (
        <p className="text-xs text-muted">
          Kode transaksi: <span className="font-mono">{transaction.transaction_code}</span>{" "}
          (dibuat otomatis, tidak dapat diubah)
        </p>
      )}

      <FormActions cancelHref="/dashboard/keuangan" />
    </form>
  );
}
