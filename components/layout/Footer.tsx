import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Youtube, MapPin } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav-items";

export function Footer() {
  return (
    <footer className="bg-navy text-white/70">
      {/* Running Text */}
      <div className="overflow-hidden border-y border-white/10 bg-black/20 py-3">
        <div className="marquee-track">
          <div className="marquee-content">
            <span>GEMARI</span>
            <span>•</span>
            <span>Gerakan Muda Mudi Blimbingsari</span>
            <span>•</span>
            <span>Bergerak Bersama</span>
            <span>•</span>
            <span>Berkarya untuk Blimbingsari</span>
            <span>•</span>

            {/* Duplikasi agar animasi berjalan terus */}
            <span>GEMARI</span>
            <span>•</span>
            <span>Gerakan Muda Mudi Blimbingsari</span>
            <span>•</span>
            <span>Bergerak Bersama</span>
            <span>•</span>
            <span>Berkarya untuk Blimbingsari</span>
            <span>•</span>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-app grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Logo GEMARI"
              width={34}
              height={34}
            />

            <div>
              <p className="text-sm font-bold text-white">GEMARI</p>
              <p className="text-xs">
                Gerakan Muda Mudi Blimbingsari
              </p>
            </div>
          </div>

          <p className="mt-4 max-w-xs text-sm">
            Bergerak bersama, berkarya untuk Blimbingsari.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <a
              href="#"
              aria-label="Instagram GEMARI"
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-brand-green"
            >
              <Instagram size={16} />
            </a>

            <a
              href="#"
              aria-label="Facebook GEMARI"
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-brand-green"
            >
              <Facebook size={16} />
            </a>

            <a
              href="#"
              aria-label="YouTube GEMARI"
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-brand-green"
            >
              <Youtube size={16} />
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Menu</p>

          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white/50">{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Profil</p>

          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link
                href="/profil/tentang"
                className="transition-colors hover:text-white"
              >
                Tentang Organisasi
              </Link>
            </li>

            <li>
              <Link
                href="/profil/sejarah"
                className="transition-colors hover:text-white"
              >
                Sejarah
              </Link>
            </li>

            <li>
              <Link
                href="/profil/struktur"
                className="transition-colors hover:text-white"
              >
                Struktur Organisasi
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Kontak</p>

          <div className="mt-4 flex items-start gap-2 text-sm">
            <MapPin size={16} className="mt-0.5 shrink-0" />
            <span>Blimbingsari</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container-app py-5 text-xs text-white/40">
          © 2026 GEMARI - Gerakan Muda Mudi Blimbingsari
        </div>
      </div>
    </footer>
  );
}
