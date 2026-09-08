import { notFound } from "next/navigation";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getMemberById, getAllDivisions } from "@/lib/data/organisasi";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MemberForm } from "@/components/dashboard/anggota/MemberForm";
import { updateMember } from "../../actions";

export const metadata = { title: "Edit Anggota" };

export default async function EditAnggotaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { id } = await params;
  const [{ error }, member, divisions] = await Promise.all([
    searchParams,
    getMemberById(id),
    getAllDivisions(),
  ]);

  if (!member) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Edit Anggota" />
      <MemberForm
        action={updateMember}
        member={member}
        divisions={divisions}
        error={error}
      />
    </div>
  );
}
