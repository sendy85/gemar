import Link from "next/link";
import Image from "next/image";
import { Pencil, User } from "lucide-react";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getAllMembersAdmin } from "@/lib/data/organisasi";
import { deleteMember } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmDeleteButton } from "@/components/dashboard/ConfirmDeleteButton";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Anggota" };
export const dynamic = "force-dynamic";

export default async function DashboardAnggotaPage() {
  await requireRole(STAFF_ROLES);
  const members = await getAllMembersAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Anggota"
        description="Kelola data anggota GEMARI."
        addHref="/dashboard/anggota/tambah"
        addLabel="Tambah Anggota"
      />

      <div className="overflow-x-auto rounded-card border border-navy/10 bg-white shadow-softer">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Bergabung</th>
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
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
                <td className="px-4 py-3">
                  <Badge variant={m.status === "aktif" ? "green" : "navy"}>
                    {m.status === "aktif" ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted">
                  {m.join_year ?? formatDate(m.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/dashboard/anggota/${m.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-brand-green-light hover:text-brand-green-dark"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <ConfirmDeleteButton
                      id={m.id}
                      action={deleteMember}
                      confirmMessage={`Hapus anggota "${m.full_name}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {members.length === 0 && (
        <p className="text-sm text-muted">Belum ada data anggota.</p>
      )}
    </div>
  );
}
