import { Users, CalendarDays, Megaphone, FileText } from "lucide-react";
import type { HomeStats } from "@/lib/data/home";

export function StatsSection({ stats }: { stats: HomeStats }) {
  const items = [
    { label: "Anggota Aktif", value: stats.totalMembers, icon: Users },
    { label: "Kegiatan", value: stats.totalActivities, icon: CalendarDays },
    { label: "Pengumuman", value: stats.totalAnnouncements, icon: Megaphone },
    { label: "Dokumen", value: stats.totalDocuments, icon: FileText },
  ];

  return (
    <section className="container-app -mt-10 relative z-10 pb-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-card border border-navy/10 bg-white p-5 shadow-soft"
          >
            <div className="inline-flex rounded-lg bg-brand-green-light p-2 text-brand-green-dark">
              <Icon size={18} />
            </div>
            <p className="mt-3 text-2xl font-bold text-navy">
              {value}
              <span className="text-brand-green">+</span>
            </p>
            <p className="text-sm text-muted">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
