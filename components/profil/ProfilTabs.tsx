"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Tentang", href: "/profil/tentang" },
  { label: "Sejarah", href: "/profil/sejarah" },
  { label: "Visi & Misi", href: "/profil/visi-misi" },
  { label: "Struktur Organisasi", href: "/profil/struktur" },
];

export function ProfilTabs() {
  const pathname = usePathname();

  return (
    <div className="border-b border-navy/10">
      <nav className="container-app -mb-px flex gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-muted hover:text-navy"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
