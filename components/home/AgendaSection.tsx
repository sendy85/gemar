import { CalendarClock, Clock, MapPin } from "lucide-react";
import type { Agenda } from "@/types/database";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

export function AgendaSection({ agendas }: { agendas: Agenda[] }) {
  return (
    <section className="bg-brand-green-light/40 py-16">
      <div className="container-app">
        <SectionHeading
          eyebrow="Jangan Sampai Terlewat"
          title="Agenda Terdekat"
          linkHref="/agenda"
          linkLabel="Lihat semua"
        />

        {agendas.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={CalendarClock}
              title="Belum ada agenda terjadwal"
              description="Agenda kegiatan mendatang akan tampil di sini."
            />
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {agendas.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-3 rounded-card border border-navy/10 bg-white p-5 shadow-softer sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-navy">{a.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock size={14} />
                      {formatDate(a.agenda_date)}
                    </span>
                    {a.agenda_time && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={14} />
                        {a.agenda_time.slice(0, 5)} WIB
                      </span>
                    )}
                    {a.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} />
                        {a.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
