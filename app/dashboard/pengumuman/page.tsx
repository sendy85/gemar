import Link from "next/link";
import { Pencil, ExternalLink } from "lucide-react";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getAllAnnouncements } from "@/lib/data/announcements";
import { deleteAnnouncement } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmDeleteButton } from "@/components/dashboard/ConfirmDeleteButton";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Pengumuman" };
export const dynamic = "force-dynamic";

export default async function DashboardPengumumanPage() {
  await requireRole(STAFF_ROLES);
  const announcements = await getAllAnnouncements();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengumuman"
        description="Kelola pengumuman resmi GEMARI."
        addHref="/dashboard/pengumuman/tambah"
        addLabel="Tambah Pengumuman"
      />

      <div className="overflow-x-auto rounded-card border border-navy/10 bg-white shadow-softer">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Judul</th>
              <th className="px-4 py-3 font-medium">Tanggal</th>
              <th className="px-4 py-3 font-medium">Penulis</th>
              <th className="px-4 py-3 font-medium">Unggulan</th>
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a.id} className="border-b border-navy/5 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{a.title}</td>
                <td className="px-4 py-3 text-muted">
                  {formatDate(a.announcement_date)}
                </td>
                <td className="px-4 py-3 text-muted">{a.author ?? "-"}</td>
                <td className="px-4 py-3">
                  {a.featured && <Badge variant="yellow">Unggulan</Badge>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/pengumuman/${a.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-navy/5"
                      title="Lihat di halaman publik"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <Link
                      href={`/dashboard/pengumuman/${a.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-brand-green-light hover:text-brand-green-dark"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <ConfirmDeleteButton
                      id={a.id}
                      action={deleteAnnouncement}
                      confirmMessage={`Hapus pengumuman "${a.title}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {announcements.length === 0 && (
        <p className="text-sm text-muted">Belum ada data pengumuman.</p>
      )}
    </div>
  );
}
