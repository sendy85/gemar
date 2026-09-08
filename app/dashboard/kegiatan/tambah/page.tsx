import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ActivityForm } from "@/components/dashboard/kegiatan/ActivityForm";
import { createActivity } from "../actions";

export const metadata = { title: "Tambah Kegiatan" };

export default async function TambahKegiatanPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Tambah Kegiatan" />
      <ActivityForm action={createActivity} error={error} />
    </div>
  );
}
