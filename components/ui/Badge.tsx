import { cn } from "@/lib/utils";

const variants = {
  green: "bg-brand-green-light text-brand-green-dark",
  red: "bg-brand-red/10 text-brand-red",
  yellow: "bg-brand-yellow/15 text-amber-700",
  blue: "bg-brand-blue/10 text-brand-blue",
  navy: "bg-navy/5 text-navy",
};

export function Badge({
  children,
  variant = "green",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
