import { ImageIcon } from "lucide-react";
import type { Activity } from "@/types/database";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActivityCard } from "@/components/kegiatan/ActivityCard";

export function ActivitiesSection({ activities }: { activities: Activity[] }) {
  return (
    <section className="container-app py-16">
      <SectionHeading
        eyebrow="Dokumentasi"
        title="Kegiatan Terbaru"
        linkHref="/kegiatan"
        linkLabel="Lihat semua"
      />

      {activities.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={ImageIcon}
            title="Belum ada kegiatan"
            description="Dokumentasi kegiatan terbaru akan tampil di sini."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      )}
    </section>
  );
}
