import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <div className="rounded-card border border-navy/10 bg-white p-5 shadow-softer">
      <div className={`inline-flex rounded-lg p-2 ${accent}`}>
        <Icon size={18} />
      </div>
      <p className="mt-3 text-xl font-bold text-navy sm:text-2xl">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
