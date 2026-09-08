import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getActivities } from "@/lib/data/activities";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GalleryForm } from "@/components/dashboard/galeri/GalleryForm";
import { createGalleryItem } from "../actions";

export const metadata = { title: "Tambah Foto" };

export default async function TambahGaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const [{ error }, activities] = await Promise.all([
    searchParams,
    getActivities(),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Tambah Foto" />
      <GalleryForm action={createGalleryItem} activities={activities} error={error} />
    </div>
  );
}
