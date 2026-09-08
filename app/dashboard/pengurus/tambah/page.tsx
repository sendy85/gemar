import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getAllDivisions } from "@/lib/data/organisasi";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { BoardMemberForm } from "@/components/dashboard/pengurus/BoardMemberForm";
import { createBoardMember } from "../actions";

export const metadata = { title: "Tambah Pengurus" };

export default async function TambahPengurusPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const [{ error }, divisions] = await Promise.all([
    searchParams,
    getAllDivisions(),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Tambah Pengurus" />
      <BoardMemberForm action={createBoardMember} divisions={divisions} error={error} />
    </div>
  );
}
