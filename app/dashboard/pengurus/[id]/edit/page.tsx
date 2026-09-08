import { notFound } from "next/navigation";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getBoardMemberById, getAllDivisions } from "@/lib/data/organisasi";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { BoardMemberForm } from "@/components/dashboard/pengurus/BoardMemberForm";
import { updateBoardMember } from "../../actions";

export const metadata = { title: "Edit Pengurus" };

export default async function EditPengurusPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { id } = await params;
  const [{ error }, boardMember, divisions] = await Promise.all([
    searchParams,
    getBoardMemberById(id),
    getAllDivisions(),
  ]);

  if (!boardMember) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Edit Pengurus" />
      <BoardMemberForm
        action={updateBoardMember}
        boardMember={boardMember}
        divisions={divisions}
        error={error}
      />
    </div>
  );
}
