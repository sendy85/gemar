import type { Metadata } from "next";
import { ImageIcon } from "lucide-react";
import { getGalleryItems } from "@/lib/data/gallery";
import { GalleryGrid } from "@/components/galeri/GalleryGrid";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Galeri" };
export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const items = await getGalleryItems();

  return (
    <div className="container-app py-12">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Galeri</h1>
      <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
        Dokumentasi foto kegiatan GEMARI. Klik foto untuk melihat lebih besar.
      </p>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={ImageIcon}
            title="Belum ada foto"
            description="Foto kegiatan yang diunggah pengurus akan tampil di sini."
          />
        </div>
      ) : (
        <div className="mt-8">
          <GalleryGrid items={items} />
        </div>
      )}
    </div>
  );
}
