import Link from "next/link";
import Image from "next/image";
import { Pencil, User } from "lucide-react";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getBoardMembers } from "@/lib/data/organisasi";
import { deleteBoardMember } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmDeleteButton } from "@/components/dashboard/ConfirmDeleteButton";

export const metadata = { title: "Pengurus" };
export const dynamic = "force-dynamic";

export default async function DashboardPengurusPage() {
  await requireRole(STAFF_ROLES);
  const boardMembers = await getBoardMembers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Pengurus"
        description="Kelola susunan pengurus GEMARI."
        addHref="/dashboard/pengurus/tambah"
        addLabel="Tambah Pengurus"
      />

      <div className="overflow-x-auto rounded-card border border-navy/10 bg-white shadow-softer">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Jabatan</th>
              <th className="px-4 py-3 font-medium">Divisi</th>
              <th className="px-4 py-3 font-medium">Periode</th>
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {boardMembers.map((m) => (
              <tr key={m.id} className="border-b border-navy/5 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-brand-green-light">
                      {m.photo_url ? (
                        <Image
                          src={m.photo_url}
                          alt={m.full_name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-brand-green-dark/40">
                          <User size={16} />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-navy">{m.full_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{m.position_title}</td>
                <td className="px-4 py-3 text-muted">
                  {m.division_name ?? "-"}
                </td>
                <td className="px-4 py-3 text-muted">{m.period}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/dashboard/pengurus/${m.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-brand-green-light hover:text-brand-green-dark"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <ConfirmDeleteButton
                      id={m.id}
                      action={deleteBoardMember}
                      confirmMessage={`Hapus pengurus "${m.full_name}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {boardMembers.length === 0 && (
        <p className="text-sm text-muted">Belum ada data pengurus.</p>
      )}
    </div>
  );
}
