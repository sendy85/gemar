import { notFound } from "next/navigation";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getActivityById } from "@/lib/data/activities";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ActivityForm } from "@/components/dashboard/kegiatan/ActivityForm";
import { updateActivity } from "../../actions";

export const metadata = { title: "Edit Kegiatan" };

export default async function EditKegiatanPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { id } = await params;
  const [{ error }, activity] = await Promise.all([
    searchParams,
    getActivityById(id),
  ]);

  if (!activity) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Edit Kegiatan" />
      <ActivityForm action={updateActivity} activity={activity} error={error} />
    </div>
  );
}
