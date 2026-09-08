import { notFound } from "next/navigation";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { getDocumentById } from "@/lib/data/documents";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DocumentMetaForm } from "@/components/dashboard/dokumen/DocumentMetaForm";
import { updateDocumentMeta } from "../../actions";

export const metadata = { title: "Edit Dokumen" };

export default async function EditDokumenPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { id } = await params;
  const [{ error }, document] = await Promise.all([
    searchParams,
    getDocumentById(id),
  ]);

  if (!document) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Edit Dokumen" />
      <DocumentMetaForm action={updateDocumentMeta} document={document} error={error} />
    </div>
  );
}
