import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TransactionForm } from "@/components/dashboard/keuangan/TransactionForm";
import { createTransaction } from "../actions";

export const metadata = { title: "Tambah Transaksi" };

export default async function TambahTransaksiPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Tambah Transaksi" />
      <TransactionForm action={createTransaction} error={error} />
    </div>
  );
}
