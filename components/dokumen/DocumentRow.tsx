import { Download, FileText } from "lucide-react";
import type { DocumentItem } from "@/types/database";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const categoryLabel: Record<DocumentItem["category"], string> = {
  proposal: "Proposal",
  lpj: "LPJ",
  notulen: "Notulen",
  ad_art: "AD/ART",
  surat: "Surat",
  lainnya: "Lainnya",
};

function formatFileSize(bytes: number | null) {
  if (!bytes) return null;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentRow({ document }: { document: DocumentItem }) {
  const size = formatFileSize(document.file_size);

  return (
    <div className="flex items-center gap-4 rounded-card border border-navy/10 bg-white p-4 shadow-softer sm:p-5">
      <div className="rounded-lg bg-brand-green-light p-2.5 text-brand-green-dark">
        <FileText size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy">
          {document.name}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
          <Badge variant="navy">{categoryLabel[document.category]}</Badge>
          <span>{formatDate(document.created_at)}</span>
          {size && <span>· {size}</span>}
        </div>
      </div>

      <a
        href={`/dokumen/download/${document.id}`}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-green px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-green-dark sm:text-sm"
      >
        <Download size={14} />
        Unduh
      </a>
    </div>
  );
}
