import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DivisionForm } from "@/components/dashboard/divisi/DivisionForm";
import { createDivision } from "../actions";

export const metadata = { title: "Tambah Divisi" };

export default async function TambahDivisiPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { error } = await searchParams;

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader title="Tambah Divisi" />
      <DivisionForm action={createDivision} error={error} />
    </div>
  );
}
