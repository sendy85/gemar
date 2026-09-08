"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, TriangleAlert } from "lucide-react";

interface DeleteButtonProps {
  action: () => Promise<void>;
  itemLabel?: string;
  className?: string;
  iconOnly?: boolean;
}

// Tombol hapus generik dipakai di semua modul dashboard. `action` adalah
// server action yang sudah di-bind dengan id baris terkait, mis.:
// <DeleteButton action={deleteKegiatan.bind(null, kegiatan.id)} />
export function DeleteButton({
  action,
  itemLabel = "data ini",
  className,
  iconOnly = true,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await action();
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Hapus"
        className={
          className ??
          "rounded-lg p-2 text-muted transition-colors hover:bg-brand-red/10 hover:text-brand-red"
        }
      >
        <Trash2 size={16} />
        {!iconOnly && <span className="ml-1.5">Hapus</span>}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy/60 p-4"
          onClick={() => !pending && setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-card bg-white p-6 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-brand-red/10 p-2 text-brand-red">
                <TriangleAlert size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-navy">Hapus data?</h3>
                <p className="mt-1 text-sm text-muted">
                  Apakah Anda yakin ingin menghapus {itemLabel}? Tindakan ini
                  tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="rounded-lg border border-navy/15 px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-navy/5 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {pending && <Loader2 size={15} className="animate-spin" />}
                {pending ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
