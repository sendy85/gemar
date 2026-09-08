import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import type { Activity } from "@/types/database";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const statusLabel: Record<Activity["status"], string> = {
  akan_datang: "Akan Datang",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
};

const statusVariant: Record<Activity["status"], "blue" | "yellow" | "green"> = {
  akan_datang: "blue",
  berlangsung: "yellow",
  selesai: "green",
};

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Link
      href={`/kegiatan/${activity.slug}`}
      className="group overflow-hidden rounded-card border border-navy/10 bg-white shadow-softer transition-shadow hover:shadow-soft"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-green-light">
        {activity.photo_url ? (
          <Image
            src={activity.photo_url}
            alt={activity.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-green-dark/40">
            <ImageIcon size={32} />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge variant={statusVariant[activity.status]}>
            {statusLabel[activity.status]}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted">{formatDate(activity.activity_date)}</p>
        <h3 className="mt-1 font-semibold text-navy group-hover:text-brand-green">
          {activity.name}
        </h3>
        {activity.location && (
          <p className="mt-1 text-sm text-muted">{activity.location}</p>
        )}
      </div>
    </Link>
  );
}
