import Link from "next/link";
import { Pencil, Network } from "lucide-react";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getOrgStructureFlat, type StructureNodeFlat } from "@/lib/data/profil";
import { deleteStructureNode } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmDeleteButton } from "@/components/dashboard/ConfirmDeleteButton";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = { title: "Struktur Organisasi" };
export const dynamic = "force-dynamic";

// Menghitung kedalaman tiap node relatif terhadap root, untuk indentasi
// visual di tabel flat (mencegah infinite loop kalau data tidak konsisten).
function computeDepth(node: StructureNodeFlat, all: StructureNodeFlat[]): number {
  let depth = 0;
  let current: StructureNodeFlat | undefined = node;
  const visited = new Set<string>();
  while (current?.parent_id && !visited.has(current.id)) {
    visited.add(current.id);
    current = all.find((n) => n.id === current!.parent_id);
    depth++;
    if (depth > 10) break;
  }
  return depth;
}

export default async function DashboardStrukturPage() {
  await requireRole(STAFF_ROLES);
  const nodes = await getOrgStructureFlat();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Struktur Organisasi"
        description="Susun hierarki jabatan yang tampil di halaman Profil → Struktur Organisasi."
        addHref="/dashboard/struktur/tambah"
        addLabel="Tambah Jabatan"
      />

      {nodes.length === 0 ? (
        <EmptyState
          icon={Network}
          title="Belum ada struktur organisasi"
          description="Tambahkan jabatan paling atas (mis. Ketua) terlebih dahulu, lalu tambahkan jabatan di bawahnya."
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-navy/10 bg-white shadow-softer">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy/10 text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Jabatan</th>
                <th className="px-4 py-3 font-medium">Dijabat oleh</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((n) => {
                const depth = computeDepth(n, nodes);
                return (
                  <tr key={n.id} className="border-b border-navy/5 last:border-0">
                    <td className="px-4 py-3">
                      <span
                        style={{ paddingLeft: `${depth * 20}px` }}
                        className="inline-flex items-center gap-1.5 font-medium text-navy"
                      >
                        {depth > 0 && <span className="text-navy/30">└</span>}
                        {n.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {n.board_member_name ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/dashboard/struktur/${n.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-brand-green-light hover:text-brand-green-dark"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <ConfirmDeleteButton
                          id={n.id}
                          action={deleteStructureNode}
                          confirmMessage={`Hapus jabatan "${n.title}"? Sub-jabatan di bawahnya juga akan terhapus.`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
