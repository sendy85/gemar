import Link from "next/link";
import { Pencil } from "lucide-react";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getAllAgendas } from "@/lib/data/agendas";
import { deleteAgenda } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmDeleteButton } from "@/components/dashboard/ConfirmDeleteButton";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Agenda" };
export const dynamic = "force-dynamic";

const statusVariant = {
  akan_datang: "blue",
  berlangsung: "yellow",
  selesai: "green",
} as const;

const statusLabel = {
  akan_datang: "Akan Datang",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
};

export default async function DashboardAgendaPage() {
  await requireRole(STAFF_ROLES);
  const agendas = await getAllAgendas();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description="Kelola jadwal agenda GEMARI."
        addHref="/dashboard/agenda/tambah"
        addLabel="Tambah Agenda"
      />

      <div className="overflow-x-auto rounded-card border border-navy/10 bg-white shadow-softer">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Judul</th>
              <th className="px-4 py-3 font-medium">Tanggal</th>
              <th className="px-4 py-3 font-medium">Lokasi</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {agendas.map((a) => (
              <tr key={a.id} className="border-b border-navy/5 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{a.title}</td>
                <td className="px-4 py-3 text-muted">
                  {formatDate(a.agenda_date)}
                  {a.agenda_time ? ` · ${a.agenda_time.slice(0, 5)}` : ""}
                </td>
                <td className="px-4 py-3 text-muted">{a.location ?? "-"}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[a.status]}>
                    {statusLabel[a.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/dashboard/agenda/${a.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-brand-green-light hover:text-brand-green-dark"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <ConfirmDeleteButton
                      id={a.id}
                      action={deleteAgenda}
                      confirmMessage={`Hapus agenda "${a.title}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {agendas.length === 0 && (
        <p className="text-sm text-muted">Belum ada data agenda.</p>
      )}
    </div>
  );
}
