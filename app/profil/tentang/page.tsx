import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tentang Organisasi" };

export default function TentangPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">
        Tentang GEMARI
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
        <p>
          GEMARI atau Gerakan Muda Mudi Blimbingsari adalah organisasi
          kepemudaan yang menghimpun anak muda di Dusun Blimbingsari dalam
          satu wadah untuk berkegiatan, belajar berorganisasi, dan memberi
          kontribusi nyata bagi lingkungan sekitar.
        </p>
        <p>
          Organisasi ini digerakkan sepenuhnya oleh pemuda-pemudi setempat,
          dengan semangat kebersamaan sebagai nilai utama. Setiap kegiatan —
          baik sosial, budaya, olahraga, maupun lingkungan — dirancang dan
          dijalankan secara gotong royong oleh anggota.
        </p>
        <p>
          Melalui berbagai program yang berjalan sepanjang tahun, GEMARI
          berupaya menjaga tradisi kebersamaan antar generasi muda, sekaligus
          membuka ruang bagi anggota untuk berkembang, berkreasi, dan
          berkontribusi bagi kemajuan Blimbingsari.
        </p>
      </div>
    </article>
  );
}
