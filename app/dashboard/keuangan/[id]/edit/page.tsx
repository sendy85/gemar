import { notFound } from "next/navigation";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getTransactionById } from "@/lib/data/finance";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TransactionForm } from "@/components/dashboard/keuangan/TransactionForm";
import { updateTransaction } from "../../actions";

export const metadata = { title: "Edit Transaksi" };

export default async function EditTransaksiPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { id } = await params;
  const [{ error }, transaction] = await Promise.all([
    searchParams,
    getTransactionById(id),
  ]);

  if (!transaction) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Edit Transaksi" />
      <TransactionForm
        action={updateTransaction}
        transaction={transaction}
        error={error}
      />
    </div>
  );
}
