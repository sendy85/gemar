"use client";

import { Trash2 } from "lucide-react";

export function ConfirmDeleteButton({
  id,
  action,
  confirmMessage = "Apakah Anda yakin ingin menghapus data ini?",
}: {
  id: string;
  action: (id: string, formData: FormData) => void | Promise<void>;
  confirmMessage?: string;
}) {
  const boundAction = action.bind(null, id);

  return (
    <form
      action={boundAction}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        title="Hapus"
        className="inline-flex items-center gap-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-brand-red/10 hover:text-brand-red"
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}
