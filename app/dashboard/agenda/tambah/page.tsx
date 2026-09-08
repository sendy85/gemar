import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AgendaForm } from "@/components/dashboard/agenda/AgendaForm";
import { createAgenda } from "../actions";

export const metadata = { title: "Tambah Agenda" };

export default async function TambahAgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Tambah Agenda" />
      <AgendaForm action={createAgenda} error={error} />
    </div>
  );
}
