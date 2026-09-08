import Link from "next/link";
import { Pencil, Download } from "lucide-react";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getDocuments } from "@/lib/data/documents";
import { deleteDocumentAction } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmDeleteButton } from "@/components/dashboard/ConfirmDeleteButton";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dokumen" };
export const dynamic = "force-dynamic";

const categoryLabel: Record<string, string> = {
  proposal: "Proposal",
  lpj: "LPJ",
  notulen: "Notulen",
  ad_art: "AD/ART",
  surat: "Surat",
  lainnya: "Lainnya",
};

export default async function DashboardDokumenPage() {
  await requireRole(STAFF_ROLES);
  const documents = await getDocuments();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dokumen"
        description="Kelola dokumen organisasi GEMARI."
        addHref="/dashboard/dokumen/tambah"
        addLabel="Unggah Dokumen"
      />

      <div className="overflow-x-auto rounded-card border border-navy/10 bg-white shadow-softer">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Visibilitas</th>
              <th className="px-4 py-3 font-medium">Diunggah</th>
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr key={d.id} className="border-b border-navy/5 last:border-0">
                <td className="px-4 py-3 font-medium text-navy">{d.name}</td>
                <td className="px-4 py-3 text-muted">
                  {categoryLabel[d.category]}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={d.is_public ? "green" : "navy"}>
                    {d.is_public ? "Publik" : "Internal"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted">
                  {formatDate(d.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/dokumen/download/${d.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-navy/5"
                      title="Unduh"
                    >
                      <Download size={16} />
                    </Link>
                    <Link
                      href={`/dashboard/dokumen/${d.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-brand-green-light hover:text-brand-green-dark"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <ConfirmDeleteButton
                      id={d.id}
                      action={deleteDocumentAction}
                      confirmMessage={`Hapus dokumen "${d.name}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {documents.length === 0 && (
        <p className="text-sm text-muted">Belum ada dokumen.</p>
      )}
    </div>
  );
}
