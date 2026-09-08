import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DocumentUploadForm } from "@/components/dashboard/dokumen/DocumentUploadForm";
import { createDocumentAction } from "../actions";

export const metadata = { title: "Unggah Dokumen" };

export default async function TambahDokumenPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Unggah Dokumen" />
      <DocumentUploadForm action={createDocumentAction} error={error} />
    </div>
  );
}
