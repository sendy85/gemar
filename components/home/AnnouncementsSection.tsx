import Link from "next/link";
import { Megaphone } from "lucide-react";
import type { Announcement } from "@/types/database";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

function isNew(dateString: string) {
  const days =
    (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24);
  return days <= 7;
}

export function AnnouncementsSection({
  announcements,
}: {
  announcements: Announcement[];
}) {
  return (
    <section className="container-app py-16">
      <SectionHeading
        eyebrow="Info Terkini"
        title="Pengumuman Terbaru"
        linkHref="/pengumuman"
        linkLabel="Lihat semua"
      />

      {announcements.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Megaphone}
            title="Belum ada pengumuman"
            description="Pengumuman dari pengurus akan tampil di sini."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((a) => (
            <Link
              key={a.id}
              href={`/pengumuman/${a.slug}`}
              className="group rounded-card border border-navy/10 bg-white p-5 shadow-softer transition-shadow hover:shadow-soft"
            >
              <div className="flex items-center gap-2">
                {isNew(a.announcement_date) && <Badge variant="red">Baru</Badge>}
                <span className="text-xs text-muted">
                  {formatDate(a.announcement_date)}
                </span>
              </div>
              <h3 className="mt-3 font-semibold text-navy group-hover:text-brand-green">
                {a.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">
                {a.content}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
