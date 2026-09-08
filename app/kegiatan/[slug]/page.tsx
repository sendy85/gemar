import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, ArrowLeft, ImageIcon } from "lucide-react";
import { getActivityBySlug } from "@/lib/data/activities";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusLabel = {
  akan_datang: "Akan Datang",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
} as const;

const statusVariant = {
  akan_datang: "blue",
  berlangsung: "yellow",
  selesai: "green",
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);
  return { title: activity?.name ?? "Kegiatan" };
}

export default async function KegiatanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);

  if (!activity) notFound();

  return (
    <div className="container-app py-12">
      <Link
        href="/kegiatan"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand-green"
      >
        <ArrowLeft size={15} />
        Kembali ke Kegiatan
      </Link>

      <div className="mt-6 overflow-hidden rounded-card border border-navy/10 bg-white shadow-softer">
        <div className="relative aspect-[16/9] w-full bg-brand-green-light">
          {activity.photo_url ? (
            <Image
              src={activity.photo_url}
              alt={activity.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-brand-green-dark/40">
              <ImageIcon size={40} />
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <Badge variant={statusVariant[activity.status]}>
            {statusLabel[activity.status]}
          </Badge>

          <h1 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
            {activity.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={15} />
              {formatDate(activity.activity_date)}
            </span>
            {activity.activity_time && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} />
                {activity.activity_time.slice(0, 5)} WIB
              </span>
            )}
            {activity.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} />
                {activity.location}
              </span>
            )}
          </div>

          {activity.description && (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink/80 sm:text-base">
              {activity.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
