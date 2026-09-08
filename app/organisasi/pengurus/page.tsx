import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { getBoardMembers } from "@/lib/data/organisasi";
import { BoardMemberCard } from "@/components/organisasi/BoardMemberCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Data Pengurus" };
export const dynamic = "force-dynamic";

export default async function PengurusPage() {
  const boardMembers = await getBoardMembers();

  const byPeriod = new Map<string, typeof boardMembers>();
  for (const m of boardMembers) {
    const list = byPeriod.get(m.period) ?? [];
    list.push(m);
    byPeriod.set(m.period, list);
  }

  return (
    <div className="container-app py-12">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">
        Data Pengurus
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
        Susunan pengurus GEMARI dari periode ke periode.
      </p>

      {byPeriod.size === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={Briefcase}
            title="Belum ada data pengurus"
            description="Data pengurus yang ditambahkan lewat dashboard admin akan tampil di sini."
          />
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {Array.from(byPeriod.entries()).map(([period, members]) => (
            <div key={period}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-green">
                Periode {period}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {members.map((m) => (
                  <BoardMemberCard key={m.id} member={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
