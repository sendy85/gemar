import Link from "next/link";
import { Sprout, Handshake, Users } from "lucide-react";

const points = [
  {
    icon: Users,
    title: "Kompak",
    text: "Kegiatan dijalankan bersama seluruh anggota, dari perencanaan sampai pelaksanaan.",
  },
  {
    icon: Sprout,
    title: "Peduli Lingkungan",
    text: "Aksi bersih lingkungan dan penghijauan jadi bagian rutin agenda organisasi.",
  },
  {
    icon: Handshake,
    title: "Peduli Masyarakat",
    text: "Hadir dalam kegiatan sosial dan gotong royong warga Blimbingsari.",
  },
];

export function AboutSection() {
  return (
    <section className="bg-navy py-16 text-white">
      <div className="container-app grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-medium text-brand-green">Tentang Kami</p>
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
            Wadah pemuda Blimbingsari untuk bergerak dan berkarya
          </h2>
          <p className="mt-4 text-sm text-white/70 sm:text-base">
            GEMARI — Gerakan Muda Mudi Blimbingsari — menghimpun pemuda-pemudi
            dusun dalam satu wadah yang aktif, kreatif, dan terbuka. Selain
            menjaga tradisi kebersamaan antar generasi, GEMARI juga menjadi
            ruang belajar berorganisasi sambil memberi dampak nyata bagi
            lingkungan dan masyarakat sekitar.
          </p>
          <Link
            href="/profil/tentang"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand-green hover:text-brand-green/80"
          >
            Selengkapnya tentang GEMARI →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {points.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-card border border-white/10 bg-white/5 p-5"
            >
              <div className="inline-flex rounded-lg bg-white/10 p-2 text-brand-green">
                <Icon size={18} />
              </div>
              <h3 className="mt-3 text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-white/60">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
