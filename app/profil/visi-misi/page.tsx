import type { Metadata } from "next";
import { Target, Compass } from "lucide-react";

export const metadata: Metadata = { title: "Visi & Misi" };

const misi = [
  "memberikan ruang dan tempat untuk pemuda/i untuk mengembangkan kreativitas.",
  "melaksanakan tugas dengan disiplin dan tanggung jawab.",
  "meningkatkan penguasaan ilmu pengetahuan dan teknologi.",
  "membentuk pemuda yang beragama dan beriman.",
  "menjadikan pemuda/i yang menjunjung tinggi nilai-nilai Pancasila.",
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
          Membangun generasi muda yang kreatif, disiplin, beriman, berkualitas dan bertanggung jawab.
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
