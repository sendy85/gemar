"use client";

import { useState } from "react";
import { CalendarClock, Clock, MapPin, List, Grid3x3 } from "lucide-react";
import type { Agenda } from "@/types/database";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AgendaCalendarView } from "@/components/agenda/AgendaCalendarView";
import { cn, formatDate } from "@/lib/utils";

const statusLabel: Record<Agenda["status"], string> = {
  akan_datang: "Akan Datang",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
};
const statusVariant: Record<Agenda["status"], "blue" | "yellow" | "green"> = {
  akan_datang: "blue",
  berlangsung: "yellow",
  selesai: "green",
};

function AgendaCard({ agenda }: { agenda: Agenda }) {
  return (
    <div className="rounded-card border border-navy/10 bg-white p-5 shadow-softer">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-navy">{agenda.title}</h3>
        <Badge variant={statusVariant[agenda.status]}>
          {statusLabel[agenda.status]}
        </Badge>
      </div>
      {agenda.description && (
        <p className="mt-2 text-sm text-muted">{agenda.description}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <CalendarClock size={14} />
          {formatDate(agenda.agenda_date)}
        </span>
        {agenda.agenda_time && (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} />
            {agenda.agenda_time.slice(0, 5)} WIB
          </span>
        )}
        {agenda.location && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} />
            {agenda.location}
          </span>
        )}
      </div>
    </div>
  );
}

export function AgendaViewSwitcher({ agendas }: { agendas: Agenda[] }) {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <div>
      <div className="flex justify-end gap-1.5">
        <button
          type="button"
          onClick={() => setView("list")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            view === "list"
              ? "border-brand-green bg-brand-green text-white"
              : "border-navy/15 text-muted hover:border-brand-green hover:text-brand-green"
          )}
        >
          <List size={15} />
          Daftar
        </button>
        <button
          type="button"
          onClick={() => setView("calendar")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            view === "calendar"
              ? "border-brand-green bg-brand-green text-white"
              : "border-navy/15 text-muted hover:border-brand-green hover:text-brand-green"
          )}
        >
          <Grid3x3 size={15} />
          Kalender
        </button>
      </div>

      <div className="mt-6">
        {view === "calendar" ? (
          <AgendaCalendarView agendas={agendas} />
        ) : agendas.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Belum ada agenda"
            description="Agenda yang dibuat pengurus akan tampil di sini."
          />
        ) : (
          <div className="space-y-3">
            {agendas.map((a) => (
              <AgendaCard key={a.id} agenda={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
