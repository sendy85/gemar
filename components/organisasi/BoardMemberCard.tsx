import Image from "next/image";
import { User } from "lucide-react";
import type { BoardMemberWithDivision } from "@/lib/data/organisasi";

export function BoardMemberCard({
  member,
}: {
  member: BoardMemberWithDivision;
}) {
  return (
    <div className="flex flex-col items-center rounded-card border border-navy/10 bg-white p-5 text-center shadow-softer transition-shadow hover:shadow-soft">
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-brand-green-light">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.full_name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-green-dark/40">
            <User size={28} />
          </div>
        )}
      </div>
      <p className="mt-3 text-sm font-semibold text-brand-green">
        {member.position_title}
      </p>
      <h3 className="mt-0.5 text-sm font-medium text-navy">
        {member.full_name}
      </h3>
      {member.division_name && (
        <p className="mt-0.5 text-xs text-muted">{member.division_name}</p>
      )}
    </div>
  );
}
