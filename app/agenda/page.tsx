import type { Metadata } from "next";
import { getAllAgendas } from "@/lib/data/agendas";
import { AgendaViewSwitcher } from "@/components/agenda/AgendaViewSwitcher";

export const metadata: Metadata = { title: "Agenda" };
export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const agendas = await getAllAgendas();

  return (
    <div className="container-app py-12">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Agenda</h1>
      <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
        Jadwal kegiatan GEMARI yang akan, sedang, dan sudah berlangsung.
        Beralih ke tampilan kalender untuk melihat sebaran per bulan.
      </p>

      <div className="mt-8">
        <AgendaViewSwitcher agendas={agendas} />
      </div>
    </div>
  );
}
