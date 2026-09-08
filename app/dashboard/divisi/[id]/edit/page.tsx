import { notFound } from "next/navigation";
import { requireRole, STAFF_ROLES } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DivisionForm } from "@/components/dashboard/divisi/DivisionForm";
import { updateDivision } from "../../actions";
import type { Division } from "@/types/database";

export const metadata = { title: "Edit Divisi" };

export default async function EditDivisiPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase
    .from("divisions")
    .select("*")
    .eq("id", id)
    .single();

  const division = data as Division | null;
  if (!division) notFound();

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader title="Edit Divisi" />
      <DivisionForm action={updateDivision} division={division} error={error} />
    </div>
  );
}
