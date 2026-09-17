import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy">
      {/* Overlay texture behind text — placeholder gradient until a real
          activity photo is uploaded to replace the background. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(31,122,77,0.35),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(45,108,223,0.25),transparent_50%)]" />

      <div className="container-app relative flex flex-col items-center py-24 text-center sm:py-28">
        <Image
          src="/logo.svg"
          alt="Logo GEMARI"
          width={84}
          height={84}
          className="h-20 w-20 sm:h-[84px] sm:w-[84px]"
          priority
        />

        <p className="mt-8 text-sm font-medium uppercase tracking-wide text-white/60">
          Selamat Datang di
        </p>
        <h1 className="mt-2 text-4xl font-bold text-white sm:text-6xl">
          GEMARI
        </h1>
        <p className="mt-3 text-base text-white/80 sm:text-lg">
          Gerakan Muda Mudi Blimbingsari
        </p>

        <p className="mt-6 max-w-lg text-balance text-sm text-white/70 sm:text-base">
          Wadah pemuda-pemudi Blimbingsari untuk bergerak, berkarya, dan
          peduli lewat kegiatan sosial, lingkungan, dan kebersamaan yang
          terus hidup dari satu generasi ke generasi berikutnya.
        </p>

        <p className="mt-4 text-sm font-medium text-white/90 sm:text-base">
          &ldquo;Bergerak bersama, berkarya untuk Blimbingsari.&rdquo;
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/profil/tentang"
            className="rounded-full bg-brand-green px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
          >
            Tentang Kami
          </Link>
          <Link
            href="/agenda"
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Lihat Agenda
          </Link>
        </div>
      </div>

      {/* Decorative wave: hijau → merah → kuning → biru */}
      <svg
        viewBox="0 0 1440 80"
        className="relative block w-full text-paper"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 C 240 90, 480 0, 720 30 C 960 60, 1200 0, 1440 40 L1440 80 L0 80 Z"
          fill="currentColor"
        />
      </svg>
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-green via-brand-red via-brand-yellow to-brand-blue" />
    </section>
  );
}
