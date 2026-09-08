"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-app flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-brand-red/10 p-4 text-brand-red">
        <AlertTriangle size={28} />
      </div>
      <h1 className="mt-5 text-lg font-semibold text-navy">
        Terjadi kesalahan
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Maaf, ada masalah saat memuat halaman ini. Coba muat ulang, atau
        kembali ke beranda.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
        >
          <RotateCw size={16} />
          Coba Lagi
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-navy/5"
        >
          Ke Beranda
        </Link>
      </div>
    </div>
  );
}
