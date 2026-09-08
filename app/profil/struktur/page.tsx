import type { Metadata } from "next";
import { Network } from "lucide-react";
import { getOrgStructure } from "@/lib/data/profil";
import { StructureTree } from "@/components/profil/StructureTree";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Struktur Organisasi" };

export default async function StrukturPage() {
  const structure = await getOrgStructure();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">
        Struktur Organisasi
      </h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Susunan kepengurusan GEMARI periode berjalan.
      </p>

      <div className="mt-8 rounded-card border border-navy/10 bg-white p-6 shadow-softer">
        {structure.length === 0 ? (
          <EmptyState
            icon={Network}
            title="Struktur organisasi belum diatur"
            description="Contoh susunan: Ketua → Wakil Ketua → Sekretaris & Bendahara → Koordinator Divisi. Data ini dapat dikelola melalui dashboard admin."
          />
        ) : (
          <StructureTree nodes={structure} />
        )}
      </div>
    </div>
  );
}
