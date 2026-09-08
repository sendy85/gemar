"use client";

import { useState } from "react";
import { Menu, LogOut, User } from "lucide-react";
import { Sidebar, MobileSidebar } from "@/components/dashboard/Sidebar";
import { DASHBOARD_NAV, filterNavForRole } from "@/lib/dashboard-nav";
import type { Profile } from "@/types/database";
import { logout } from "@/app/login/actions";

const roleLabel: Record<Profile["role"], string> = {
  admin: "Admin",
  pengurus: "Pengurus",
  anggota: "Anggota",
};

export function DashboardShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Dihitung di client supaya komponen ikon (fungsi React) tidak perlu
  // melewati batas serialisasi Server → Client Component.
  const items = filterNavForRole(DASHBOARD_NAV, profile.role);

  return (
    <div className="flex min-h-screen bg-[#F5F7F6]">
      <Sidebar items={items} />
      <MobileSidebar
        items={items}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy/10 bg-white px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
            className="rounded-lg p-2 text-navy hover:bg-navy/5 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-navy">
                {profile.full_name}
              </p>
              <p className="text-xs text-muted">{roleLabel[profile.role]}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-light text-brand-green-dark">
              <User size={17} />
            </div>
            <form action={logout}>
              <button
                type="submit"
                aria-label="Keluar"
                className="rounded-lg p-2 text-muted hover:bg-navy/5 hover:text-brand-red"
                title="Keluar"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
