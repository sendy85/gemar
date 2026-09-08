import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <Image src="/logo.svg" alt="Logo GEMARI" width={64} height={64} />
      <h1 className="mt-6 text-4xl font-bold text-navy">404</h1>
      <p className="mt-2 text-lg font-semibold text-navy">
        Halaman tidak ditemukan
      </p>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau
        alamatnya salah ketik.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
      >
        <Home size={16} />
        Kembali ke Beranda
      </Link>
    </div>
  );
}
