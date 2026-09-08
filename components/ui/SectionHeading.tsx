import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  linkHref,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="text-sm font-medium text-brand-green">{eyebrow}</p>
        )}
        <h2 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-xl text-sm text-muted">{description}</p>
        )}
      </div>

      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand-green hover:text-brand-green-dark"
        >
          {linkLabel}
          <ArrowUpRight size={15} />
        </Link>
      )}
    </div>
  );
}
