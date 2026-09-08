import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  Network,
  CalendarDays,
  CalendarClock,
  Megaphone,
  Wallet,
  Image as ImageIcon,
  FileText,
  Settings,
} from "lucide-react";
import type { UserRole } from "@/types/database";

export interface DashboardNavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export interface DashboardNavGroup {
  label: string;
  roles: UserRole[];
  links: DashboardNavLink[];
}

export type DashboardNavItem = DashboardNavLink | DashboardNavGroup;

export function isNavGroup(item: DashboardNavItem): item is DashboardNavGroup {
  return "links" in item;
}

const STAFF: UserRole[] = ["admin", "pengurus"];
const ALL: UserRole[] = ["admin", "pengurus", "anggota"];

// Struktur sidebar dashboard. Setiap item punya daftar role yang boleh
// melihatnya — ini HANYA mengatur tampilan menu. Akses data tetap
// ditegakkan oleh RLS di database dan `requireRole()` di setiap halaman,
// jadi menyembunyikan menu di sini bukan satu-satunya lapisan keamanan.
export const DASHBOARD_NAV: DashboardNavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ALL,
  },
  {
    label: "Organisasi",
    roles: STAFF,
    links: [
      { label: "Anggota", href: "/dashboard/anggota", icon: Users, roles: STAFF },
      { label: "Pengurus", href: "/dashboard/pengurus", icon: Briefcase, roles: STAFF },
      { label: "Divisi", href: "/dashboard/divisi", icon: Layers, roles: STAFF },
      { label: "Struktur", href: "/dashboard/struktur", icon: Network, roles: STAFF },
    ],
  },
  {
    label: "Kegiatan",
    roles: STAFF,
    links: [
      { label: "Kegiatan", href: "/dashboard/kegiatan", icon: CalendarDays, roles: STAFF },
      { label: "Agenda", href: "/dashboard/agenda", icon: CalendarClock, roles: STAFF },
      { label: "Pengumuman", href: "/dashboard/pengumuman", icon: Megaphone, roles: STAFF },
    ],
  },
  {
    label: "Keuangan",
    roles: STAFF,
    links: [
      { label: "Transaksi", href: "/dashboard/keuangan", icon: Wallet, roles: STAFF },
    ],
  },
  {
    label: "Galeri",
    href: "/dashboard/galeri",
    icon: ImageIcon,
    roles: STAFF,
  },
  {
    label: "Dokumen",
    href: "/dashboard/dokumen",
    icon: FileText,
    roles: STAFF,
  },
  {
    label: "Pengaturan",
    href: "/dashboard/pengaturan",
    icon: Settings,
    roles: ["admin"],
  },
];

export function filterNavForRole(
  nav: DashboardNavItem[],
  role: UserRole
): DashboardNavItem[] {
  return nav
    .filter((item) => item.roles.includes(role))
    .map((item) =>
      isNavGroup(item)
        ? { ...item, links: item.links.filter((l) => l.roles.includes(role)) }
        : item
    )
    .filter((item) => !isNavGroup(item) || item.links.length > 0);
}
