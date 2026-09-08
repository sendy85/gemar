import { notFound } from "next/navigation";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getAgendaById } from "@/lib/data/agendas";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AgendaForm } from "@/components/dashboard/agenda/AgendaForm";
import { updateAgenda } from "../../actions";

export const metadata = { title: "Edit Agenda" };

export default async function EditAgendaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { id } = await params;
  const [{ error }, agenda] = await Promise.all([searchParams, getAgendaById(id)]);

  if (!agenda) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Edit Agenda" />
      <AgendaForm action={updateAgenda} agenda={agenda} error={error} />
    </div>
  );
}
