import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-navy/15 px-6 py-14 text-center">
      <div className="rounded-full bg-brand-green-light p-3 text-brand-green-dark">
        <Icon size={22} />
      </div>
      <p className="mt-4 text-sm font-medium text-navy">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      )}
    </div>
  );
}
