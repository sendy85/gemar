import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sejarah" };

export default function SejarahPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">
        Sejarah GEMARI
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
        <p>
          GEMARI lahir dari inisiatif sekelompok pemuda Blimbingsari yang
          ingin menghadirkan wadah kebersamaan yang lebih terstruktur di
          tengah masyarakat. Berawal dari kumpul-kumpul santai dan kegiatan
          gotong royong sederhana, semangat itu perlahan tumbuh menjadi
          sebuah organisasi dengan susunan kepengurusan dan program kerja
          yang lebih jelas.
        </p>
        <p>
          Seiring berjalannya waktu, GEMARI terus berkembang mengikuti
          kebutuhan dan aspirasi anggotanya  mulai dari kegiatan sosial,
          keagamaan, olahraga, hingga aksi peduli lingkungan. Setiap periode
          kepengurusan membawa warna dan program barunya sendiri, namun
          semangat kebersamaan yang menjadi fondasi awal tetap terjaga.
        </p>
        <p>
          Kini, GEMARI hadir sebagai bagian penting dari kehidupan pemuda
          Blimbingsari, menjadi ruang belajar, berkarya, dan mempererat tali
          silaturahmi antar generasi.
        </p>
      </div>
    </article>
  );
}
