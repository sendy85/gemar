import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getDivisionsWithCount } from "@/lib/data/organisasi";
import { deleteDivision } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmDeleteButton } from "@/components/dashboard/ConfirmDeleteButton";
import { Pencil } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Divisi" };
export const dynamic = "force-dynamic";

export default async function DashboardDivisiPage() {
  await requireRole(STAFF_ROLES);
  const divisions = await getDivisionsWithCount();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Divisi"
        description="Kelola divisi-divisi organisasi GEMARI."
        addHref="/dashboard/divisi/tambah"
        addLabel="Tambah Divisi"
      />

      <div className="overflow-x-auto rounded-card border border-navy/10 bg-white shadow-softer">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Nama Divisi</th>
              <th className="px-4 py-3 font-medium">Ketua</th>
              <th className="px-4 py-3 font-medium">Anggota</th>
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {divisions.map((d) => (
              <tr key={d.id} className="border-b border-navy/5 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{d.name}</td>
                <td className="px-4 py-3 text-muted">{d.head_name ?? "-"}</td>
                <td className="px-4 py-3 text-muted">{d.member_count}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/dashboard/divisi/${d.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-brand-green-light hover:text-brand-green-dark"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <ConfirmDeleteButton
                      id={d.id}
                      action={deleteDivision}
                      confirmMessage={`Hapus divisi "${d.name}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {divisions.length === 0 && (
        <p className="text-sm text-muted">Belum ada data divisi.</p>
      )}
    </div>
  );
}
