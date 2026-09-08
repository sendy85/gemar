import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { getAllAnnouncements } from "@/lib/data/announcements";
import { AnnouncementCard } from "@/components/pengumuman/AnnouncementCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Pengumuman" };
export const dynamic = "force-dynamic";

export default async function PengumumanPage() {
  const announcements = await getAllAnnouncements();
  const featured = announcements.filter((a) => a.featured);
  const rest = announcements.filter((a) => !a.featured);
  const ordered = [...featured, ...rest];

  return (
    <div className="container-app py-12">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Pengumuman</h1>
      <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
        Informasi resmi dan pengumuman terbaru dari pengurus GEMARI.
      </p>

      {ordered.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={Megaphone}
            title="Belum ada pengumuman"
            description="Pengumuman dari pengurus akan tampil di sini."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      )}
    </div>
  );
}
