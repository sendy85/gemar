import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import type { DivisionWithCount } from "@/lib/data/organisasi";

export function DivisionCard({ division }: { division: DivisionWithCount }) {
  return (
    <div className="flex flex-col rounded-card border border-navy/10 bg-white p-6 shadow-softer">
      <h3 className="text-lg font-semibold text-navy">{division.name}</h3>
      {division.description && (
        <p className="mt-2 text-sm text-muted">{division.description}</p>
      )}
      {division.head_name && (
        <p className="mt-3 text-sm text-muted">
          Ketua Divisi:{" "}
          <span className="font-medium text-navy">{division.head_name}</span>
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-navy/10 pt-4">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <Users size={15} />
          {division.member_count} anggota
        </span>
        <Link
          href={`/organisasi/anggota?divisi=${division.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-green hover:text-brand-green-dark"
        >
          Lihat anggota
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
