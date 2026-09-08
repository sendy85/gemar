import { notFound } from "next/navigation";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getAnnouncementById } from "@/lib/data/announcements";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AnnouncementForm } from "@/components/dashboard/pengumuman/AnnouncementForm";
import { updateAnnouncement } from "../../actions";

export const metadata = { title: "Edit Pengumuman" };

export default async function EditPengumumanPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { id } = await params;
  const [{ error }, announcement] = await Promise.all([
    searchParams,
    getAnnouncementById(id),
  ]);

  if (!announcement) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Edit Pengumuman" />
      <AnnouncementForm
        action={updateAnnouncement}
        announcement={announcement}
        error={error}
      />
    </div>
  );
}
