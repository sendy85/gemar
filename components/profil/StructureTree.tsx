import Image from "next/image";
import { User } from "lucide-react";
import type { StructureNode } from "@/lib/data/profil";

function NodeCard({ node }: { node: StructureNode }) {
  return (
    <div className="flex w-40 flex-col items-center rounded-card border border-navy/10 bg-white p-3 text-center shadow-softer">
      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-brand-green-light">
        {node.board_member?.photo_url ? (
          <Image
            src={node.board_member.photo_url}
            alt={node.board_member.full_name}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-green-dark/50">
            <User size={20} />
          </div>
        )}
      </div>
      <p className="mt-2 text-xs font-semibold text-navy">{node.title}</p>
      {node.board_member && (
        <p className="mt-0.5 text-[11px] text-muted">
          {node.board_member.full_name}
        </p>
      )}
    </div>
  );
}

function TreeLevel({ nodes }: { nodes: StructureNode[] }) {
  if (nodes.length === 0) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-6">
        {nodes.map((node) => (
          <div key={node.id} className="flex flex-col items-center">
            <NodeCard node={node} />
            {node.children.length > 0 && (
              <div className="h-6 w-px bg-navy/15" />
            )}
          </div>
        ))}
      </div>
      {nodes.some((n) => n.children.length > 0) && (
        <div className="mt-0">
          <TreeLevel nodes={nodes.flatMap((n) => n.children)} />
        </div>
      )}
    </div>
  );
}

export function StructureTree({ nodes }: { nodes: StructureNode[] }) {
  return (
    <div className="overflow-x-auto py-4">
      <div className="min-w-max">
        <TreeLevel nodes={nodes} />
      </div>
    </div>
  );
}
