import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getGalleryItems } from "@/lib/data/gallery";
import { deleteGalleryItem } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmDeleteButton } from "@/components/dashboard/ConfirmDeleteButton";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Galeri" };
export const dynamic = "force-dynamic";

export default async function DashboardGaleriPage() {
  await requireRole(STAFF_ROLES);
  const items = await getGalleryItems();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Galeri"
        description="Kelola foto dokumentasi kegiatan GEMARI."
        addHref="/dashboard/galeri/tambah"
        addLabel="Tambah Foto"
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-card border border-navy/10 bg-white shadow-softer"
          >
            <div className="relative aspect-square bg-brand-green-light">
              <Image
                src={item.photo_url}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium text-navy">
                {item.title}
              </p>
              <p className="text-xs text-muted">{formatDate(item.photo_date)}</p>
              <div className="mt-2 flex justify-end gap-1">
                <Link
                  href={`/dashboard/galeri/${item.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-lg p-1.5 text-muted transition-colors hover:bg-brand-green-light hover:text-brand-green-dark"
                  title="Edit"
                >
                  <Pencil size={15} />
                </Link>
                <ConfirmDeleteButton
                  id={item.id}
                  action={deleteGalleryItem}
                  confirmMessage={`Hapus foto "${item.title}"?`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-sm text-muted">Belum ada foto di galeri.</p>
      )}
    </div>
  );
}
