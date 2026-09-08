"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, LogIn, Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav-items";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy">
      <div className="container-app flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/logo.svg"
            alt="Logo GEMARI"
            width={38}
            height={38}
            className="h-9 w-9"
            priority
          />
          <span className="leading-tight text-white">
            <span className="block text-base font-bold tracking-tight">
              GEMARI
            </span>
            <span className="block text-[11px] text-white/60">
              Gerakan Muda Mudi Blimbingsari
            </span>
          </span>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                  <ChevronDown
                    size={15}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                </button>

                <div className="invisible absolute left-0 top-full w-56 translate-y-1 rounded-xl border border-navy/10 bg-white p-1.5 opacity-0 shadow-soft transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-lg px-3 py-2 text-sm text-ink/80 transition-colors hover:bg-brand-green-light hover:text-brand-green-dark"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            )
          )}

          <Link
            href="/login"
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
          >
            <LogIn size={16} />
            Masuk
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-2 text-white lg:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu (accordion) */}
      <div
        className={cn(
          "overflow-hidden border-t border-white/10 bg-navy lg:hidden",
          mobileOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0"
        )}
      >
        <nav className="container-app flex flex-col gap-1 py-3">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenAccordion((v) => (v === item.label ? null : item.label))
                  }
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-white/90"
                >
                  {item.label}
                  <ChevronDown
                    size={16}
                    className={cn(
                      "transition-transform duration-200",
                      openAccordion === item.label && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden pl-3 transition-all duration-200",
                    openAccordion === item.label ? "max-h-60" : "max-h-0"
                  )}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:text-white"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/90"
              >
                {item.label}
              </Link>
            )
          )}

          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-4 py-2.5 text-sm font-medium text-white"
          >
            <LogIn size={16} />
            Masuk
          </Link>
        </nav>
      </div>
    </header>
  );
}
