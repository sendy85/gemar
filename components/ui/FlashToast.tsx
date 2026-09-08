"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CheckCircle2, XCircle, X } from "lucide-react";

type Flash = { type: "success" | "error"; text: string };

// Toast dipisah jadi komponen sendiri dengan `key` unik per pesan di induknya
// (lihat FlashToast di bawah) — supaya setiap pesan baru mendapat instance
// state `dismissed` yang segar tanpa perlu me-reset-nya secara sinkron di
// dalam effect (yang dilarang oleh aturan react-hooks/set-state-in-effect).
function Toast({ flash, onExpire }: { flash: Flash; onExpire: () => void }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDismissed(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed) return null;

  const isSuccess = flash.type === "success";

  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium shadow-soft ${
        isSuccess ? "bg-brand-green text-white" : "bg-brand-red text-white"
      }`}
    >
      {isSuccess ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
      {flash.text}
      <button
        type="button"
        onClick={() => {
          setDismissed(true);
          onExpire();
        }}
        aria-label="Tutup notifikasi"
        className="ml-1 rounded p-0.5 hover:bg-white/20"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// Dipakai bersama server action + redirect: setelah aksi (simpan/hapus dll)
// server action redirect ke halaman yang sama dengan ?success=... atau
// ?error=..., lalu komponen ini menampilkannya sebagai toast sebentar dan
// membersihkan query string-nya supaya tidak muncul lagi saat refresh.
export function FlashToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const success = searchParams.get("success");
  const error = searchParams.get("error");
  const flash: Flash | null = success
    ? { type: "success", text: success }
    : error
      ? { type: "error", text: error }
      : null;

  const cleanedKeyRef = useRef<string | null>(null);
  const flashKey = flash ? `${flash.type}:${flash.text}` : null;

  useEffect(() => {
    if (!flashKey || cleanedKeyRef.current === flashKey) return;
    cleanedKeyRef.current = flashKey;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("success");
    params.delete("error");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashKey]);

  if (!flash || !flashKey) return null;

  return (
    <div className="fixed inset-x-4 top-4 z-[70] flex justify-center sm:inset-x-auto sm:right-6">
      <Toast key={flashKey} flash={flash} onExpire={() => {}} />
    </div>
  );
}
