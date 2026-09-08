import { notFound } from "next/navigation";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getBoardMembers } from "@/lib/data/organisasi";
import { getOrgStructureFlat, getStructureNodeById } from "@/lib/data/profil";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StructureNodeForm } from "@/components/dashboard/struktur/StructureNodeForm";
import { updateStructureNode } from "../../actions";

export const metadata = { title: "Edit Jabatan" };

export default async function EditStrukturPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { id } = await params;
  const [{ error }, node, boardMembers, otherNodes] = await Promise.all([
    searchParams,
    getStructureNodeById(id),
    getBoardMembers(),
    getOrgStructureFlat(),
  ]);

  if (!node) notFound();

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader title="Edit Jabatan" />
      <StructureNodeForm
        action={updateStructureNode}
        node={node}
        boardMembers={boardMembers}
        otherNodes={otherNodes}
        error={error}
      />
    </div>
  );
}
