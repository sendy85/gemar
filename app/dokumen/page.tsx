import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { getDocuments } from "@/lib/data/documents";
import { DocumentRow } from "@/components/dokumen/DocumentRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import type { DocumentCategory } from "@/types/database";

export const metadata: Metadata = { title: "Dokumen" };
export const dynamic = "force-dynamic";

const CATEGORIES: { label: string; value?: DocumentCategory }[] = [
  { label: "Semua" },
  { label: "Proposal", value: "proposal" },
  { label: "LPJ", value: "lpj" },
  { label: "Notulen", value: "notulen" },
  { label: "AD/ART", value: "ad_art" },
  { label: "Surat", value: "surat" },
  { label: "Lainnya", value: "lainnya" },
];

export default async function DokumenPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const activeCategory = kategori as DocumentCategory | undefined;
  const documents = await getDocuments(activeCategory);

  return (
    <div className="container-app py-12">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Dokumen</h1>
      <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
        Dokumen organisasi yang dapat diakses publik. Sebagian dokumen bersifat
        internal dan hanya bisa diakses pengurus setelah masuk.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const isActive = activeCategory === c.value;
          const href = c.value ? `/dokumen?kategori=${c.value}` : "/dokumen";
          return (
            <Link
              key={c.label}
              href={href}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-brand-green bg-brand-green text-white"
                  : "border-navy/15 text-muted hover:border-brand-green hover:text-brand-green"
              )}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {documents.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={FileText}
            title="Belum ada dokumen"
            description="Dokumen publik yang diunggah pengurus akan tampil di sini."
          />
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {documents.map((d) => (
            <DocumentRow key={d.id} document={d} />
          ))}
        </div>
      )}
    </div>
  );
}
