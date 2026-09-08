import { notFound } from "next/navigation";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getGalleryItemById } from "@/lib/data/gallery";
import { getActivities } from "@/lib/data/activities";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GalleryForm } from "@/components/dashboard/galeri/GalleryForm";
import { updateGalleryItem } from "../../actions";

export const metadata = { title: "Edit Foto" };

export default async function EditGaleriPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { id } = await params;
  const [{ error }, item, activities] = await Promise.all([
    searchParams,
    getGalleryItemById(id),
    getActivities(),
  ]);

  if (!item) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Edit Foto" />
      <GalleryForm
        action={updateGalleryItem}
        item={item}
        activities={activities}
        error={error}
      />
    </div>
  );
}
