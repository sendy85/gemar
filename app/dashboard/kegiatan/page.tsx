import Link from "next/link";
import { Pencil, ExternalLink } from "lucide-react";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getActivities } from "@/lib/data/activities";
import { deleteActivity } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmDeleteButton } from "@/components/dashboard/ConfirmDeleteButton";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Kegiatan" };
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

export default async function DashboardKegiatanPage() {
  await requireRole(STAFF_ROLES);
  const activities = await getActivities();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kegiatan"
        description="Kelola daftar kegiatan GEMARI."
        addHref="/dashboard/kegiatan/tambah"
        addLabel="Tambah Kegiatan"
      />

      <div className="overflow-x-auto rounded-card border border-navy/10 bg-white shadow-softer">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Nama Kegiatan</th>
              <th className="px-4 py-3 font-medium">Tanggal</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a.id} className="border-b border-navy/5 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{a.name}</td>
                <td className="px-4 py-3 text-muted">
                  {formatDate(a.activity_date)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[a.status]}>
                    {statusLabel[a.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/kegiatan/${a.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-navy/5"
                      title="Lihat di halaman publik"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <Link
                      href={`/dashboard/kegiatan/${a.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-brand-green-light hover:text-brand-green-dark"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <ConfirmDeleteButton
                      id={a.id}
                      action={deleteActivity}
                      confirmMessage={`Hapus kegiatan "${a.name}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {activities.length === 0 && (
        <p className="text-sm text-muted">Belum ada data kegiatan.</p>
      )}
    </div>
  );
}
