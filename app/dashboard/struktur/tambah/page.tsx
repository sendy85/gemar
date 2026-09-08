import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getBoardMembers } from "@/lib/data/organisasi";
import { getOrgStructureFlat } from "@/lib/data/profil";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StructureNodeForm } from "@/components/dashboard/struktur/StructureNodeForm";
import { createStructureNode } from "../actions";

export const metadata = { title: "Tambah Jabatan" };

export default async function TambahStrukturPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const [{ error }, boardMembers, otherNodes] = await Promise.all([
    searchParams,
    getBoardMembers(),
    getOrgStructureFlat(),
  ]);

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader title="Tambah Jabatan" />
      <StructureNodeForm
        action={createStructureNode}
        boardMembers={boardMembers}
        otherNodes={otherNodes}
        error={error}
      />
    </div>
  );
}
