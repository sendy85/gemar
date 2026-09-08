import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Announcement } from "@/types/database";

function isNew(dateString: string) {
  const days =
    (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24);
  return days <= 7;
}

export function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  return (
    <Link
      href={`/pengumuman/${announcement.slug}`}
      className="group block rounded-card border border-navy/10 bg-white p-5 shadow-softer transition-shadow hover:shadow-soft"
    >
      <div className="flex flex-wrap items-center gap-2">
        {announcement.featured && <Badge variant="yellow">Unggulan</Badge>}
        {isNew(announcement.announcement_date) && (
          <Badge variant="red">Baru</Badge>
        )}
        <span className="text-xs text-muted">
          {formatDate(announcement.announcement_date)}
        </span>
      </div>
      <h3 className="mt-3 font-semibold text-navy group-hover:text-brand-green">
        {announcement.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">
        {announcement.content}
      </p>
      {announcement.author && (
        <p className="mt-3 text-xs text-muted">Oleh {announcement.author}</p>
      )}
    </Link>
  );
}
