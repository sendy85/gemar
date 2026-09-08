import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getAllDivisions } from "@/lib/data/organisasi";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MemberForm } from "@/components/dashboard/anggota/MemberForm";
import { createMember } from "../actions";

export const metadata = { title: "Tambah Anggota" };

export default async function TambahAnggotaPage({
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
      <PageHeader title="Tambah Anggota" />
      <MemberForm action={createMember} divisions={divisions} error={error} />
    </div>
  );
}
