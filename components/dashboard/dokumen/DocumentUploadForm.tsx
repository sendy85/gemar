import {
  FormField,
  FormError,
  FormActions,
  fieldInputClass,
} from "@/components/dashboard/FormField";

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "proposal", label: "Proposal" },
  { value: "lpj", label: "LPJ" },
  { value: "notulen", label: "Notulen" },
  { value: "ad_art", label: "AD/ART" },
  { value: "surat", label: "Surat" },
  { value: "lainnya", label: "Lainnya" },
];

export function DocumentUploadForm({
  action,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
}) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-card border border-navy/10 bg-white p-6 shadow-softer"
    >
      <FormError message={error} />

      <FormField label="Nama Dokumen" htmlFor="name" required>
        <input id="name" name="name" required className={fieldInputClass} />
      </FormField>

      <FormField label="Kategori" htmlFor="category" required>
        <select id="category" name="category" required className={fieldInputClass} defaultValue="">
          <option value="" disabled>
            Pilih kategori
          </option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="File"
        htmlFor="file"
        required
        hint="PDF, Word, atau Excel. Maksimal 20MB."
      >
        <input
          id="file"
          name="file"
          type="file"
          required
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-green-light file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-brand-green-dark hover:file:bg-brand-green/20"
        />
      </FormField>

      <label className="flex items-center gap-2 text-sm text-navy">
        <input
          type="checkbox"
          name="is_public"
          className="h-4 w-4 rounded border-navy/25 text-brand-green focus:ring-brand-green"
        />
        Tampilkan ke publik (tanpa perlu login)
      </label>

      <FormActions cancelHref="/dashboard/dokumen" submitLabel="Unggah" />
    </form>
  );
}
