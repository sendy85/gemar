import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { getPublicMembers, getDivisionsWithCount } from "@/lib/data/organisasi";
import { MemberCard } from "@/components/organisasi/MemberCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Data Anggota" };
export const dynamic = "force-dynamic";

export default async function AnggotaPage({
  searchParams,
}: {
  searchParams: Promise<{ divisi?: string }>;
}) {
  const { divisi } = await searchParams;
  const [members, divisions] = await Promise.all([
    getPublicMembers(divisi),
    getDivisionsWithCount(),
  ]);

  return (
    <div className="container-app py-12">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">
        Data Anggota
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
        Daftar anggota aktif GEMARI. Data pribadi seperti alamat dan nomor
        telepon tidak ditampilkan di halaman publik demi privasi anggota.
      </p>

      {divisions.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/organisasi/anggota"
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              !divisi
                ? "border-brand-green bg-brand-green text-white"
                : "border-navy/15 text-muted hover:border-brand-green hover:text-brand-green"
            )}
          >
            Semua Divisi
          </Link>
          {divisions.map((d) => (
            <Link
              key={d.id}
              href={`/organisasi/anggota?divisi=${d.id}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                divisi === d.id
                  ? "border-brand-green bg-brand-green text-white"
                  : "border-navy/15 text-muted hover:border-brand-green hover:text-brand-green"
              )}
            >
              {d.name}
            </Link>
          ))}
        </div>
      )}

      {members.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={Users}
            title="Belum ada data anggota"
            description="Data anggota yang ditambahkan pengurus lewat dashboard akan tampil di sini."
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      )}
    </div>
  );
}
