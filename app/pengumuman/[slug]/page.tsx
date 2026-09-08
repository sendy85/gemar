import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { getAnnouncementBySlug } from "@/lib/data/announcements";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);
  return { title: announcement?.title ?? "Pengumuman" };
}

export default async function PengumumanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);

  if (!announcement) notFound();

  return (
    <div className="container-app py-12">
      <Link
        href="/pengumuman"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand-green"
      >
        <ArrowLeft size={15} />
        Kembali ke Pengumuman
      </Link>

      <article className="mx-auto mt-6 max-w-3xl rounded-card border border-navy/10 bg-white p-6 shadow-softer sm:p-8">
        {announcement.featured && (
          <Badge variant="yellow">Pengumuman Unggulan</Badge>
        )}

        <h1 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
          {announcement.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={15} />
            {formatDate(announcement.announcement_date)}
          </span>
          {announcement.author && (
            <span className="inline-flex items-center gap-1.5">
              <User size={15} />
              {announcement.author}
            </span>
          )}
        </div>

        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink/80 sm:text-base">
          {announcement.content}
        </p>
      </article>
    </div>
  );
}
