"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  isNavGroup,
  type DashboardNavItem,
} from "@/lib/dashboard-nav";

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  onNavigate,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-brand-green text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}

function SidebarContent({
  items,
  pathname,
  onNavigate,
}: {
  items: DashboardNavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {items.map((item) =>
        isNavGroup(item) ? (
          <div key={item.label} className="mt-4 first:mt-0">
            <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
              {item.label}
            </p>
            <div className="flex flex-col gap-1">
              {item.links.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  icon={link.icon}
                  label={link.label}
                  active={pathname === link.href}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ) : (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href}
            onNavigate={onNavigate}
          />
        )
      )}
    </nav>
  );
}

export function Sidebar({ items }: { items: DashboardNavItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto bg-navy py-5 lg:block">
      <Link href="/" className="flex items-center gap-2.5 px-4">
        <Image src="/logo.svg" alt="Logo GEMARI" width={32} height={32} />
        <span className="text-sm font-bold text-white">GEMARI Admin</span>
      </Link>
      <div className="mt-6">
        <SidebarContent items={items} pathname={pathname} />
      </div>
    </aside>
  );
}

export function MobileSidebar({
  items,
  open,
  onClose,
}: {
  items: DashboardNavItem[];
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-navy/60" onClick={onClose} />
      <aside className="absolute left-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto bg-navy py-5">
        <div className="flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <Image src="/logo.svg" alt="Logo GEMARI" width={32} height={32} />
            <span className="text-sm font-bold text-white">GEMARI Admin</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-6">
          <SidebarContent items={items} pathname={pathname} onNavigate={onClose} />
        </div>
      </aside>
    </div>
  );
}
