import Link from "next/link";
import { Plus } from "lucide-react";

export function PageHeader({
  title,
  description,
  addHref,
  addLabel = "Tambah",
}: {
  title: string;
  description?: string;
  addHref?: string;
  addLabel?: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-xl font-bold text-navy sm:text-2xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      {addHref && (
        <Link
          href={addHref}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
        >
          <Plus size={16} />
          {addLabel}
        </Link>
      )}
    </div>
  );
}
