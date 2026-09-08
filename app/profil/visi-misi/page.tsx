import type { Metadata } from "next";
import { Target, Compass } from "lucide-react";

export const metadata: Metadata = { title: "Visi & Misi" };

const misi = [
  "Menghimpun dan mempersatukan pemuda-pemudi Blimbingsari dalam satu wadah organisasi.",
  "Mengadakan kegiatan sosial, budaya, dan olahraga yang mempererat kebersamaan antar anggota.",
  "Menumbuhkan kepedulian terhadap lingkungan melalui aksi bersih dan penghijauan.",
  "Mendorong partisipasi aktif pemuda dalam kegiatan kemasyarakatan di Blimbingsari.",
  "Mengelola organisasi secara transparan, tertib administrasi, dan akuntabel.",
];

export default function VisiMisiPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">
        Visi & Misi
      </h1>

      <div className="mt-8 rounded-card border border-navy/10 bg-white p-6 shadow-softer">
        <div className="inline-flex rounded-lg bg-brand-green-light p-2 text-brand-green-dark">
          <Compass size={20} />
        </div>
        <h2 className="mt-3 text-lg font-semibold text-navy">Visi</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
          Menjadi wadah pemuda Blimbingsari yang aktif, kompak, kreatif, dan
          peduli terhadap lingkungan serta masyarakat sekitar.
        </p>
      </div>

      <div className="mt-6 rounded-card border border-navy/10 bg-white p-6 shadow-softer">
        <div className="inline-flex rounded-lg bg-brand-green-light p-2 text-brand-green-dark">
          <Target size={20} />
        </div>
        <h2 className="mt-3 text-lg font-semibold text-navy">Misi</h2>
        <ul className="mt-3 space-y-2.5">
          {misi.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted sm:text-base">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
