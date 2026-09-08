import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AnnouncementForm } from "@/components/dashboard/pengumuman/AnnouncementForm";
import { createAnnouncement } from "../actions";

export const metadata = { title: "Tambah Pengumuman" };

export default async function TambahPengumumanPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Tambah Pengumuman" />
      <AnnouncementForm action={createAnnouncement} error={error} />
    </div>
  );
}
