import type { Metadata } from "next";
import { Layers } from "lucide-react";
import { getDivisionsWithCount } from "@/lib/data/organisasi";
import { DivisionCard } from "@/components/organisasi/DivisionCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Divisi" };
export const dynamic = "force-dynamic";

export default async function DivisiPage() {
  const divisions = await getDivisionsWithCount();

  return (
    <div className="container-app py-12">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Divisi</h1>
      <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
        Divisi-divisi yang menjalankan program kerja GEMARI sehari-hari.
      </p>

      {divisions.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={Layers}
            title="Belum ada data divisi"
            description="Data divisi yang ditambahkan lewat dashboard admin akan tampil di sini."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {divisions.map((d) => (
            <DivisionCard key={d.id} division={d} />
          ))}
        </div>
      )}
    </div>
  );
}
