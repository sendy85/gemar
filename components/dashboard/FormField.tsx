export const fieldInputClass =
  "w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-green disabled:bg-navy/5";
export const fieldLabelClass = "mb-1.5 block text-sm font-medium text-navy";

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={fieldLabelClass}>
        {label}
        {required && <span className="ml-0.5 text-brand-red">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="rounded-lg bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
      {message}
    </div>
  );
}

export function FormActions({
  cancelHref,
  submitLabel = "Simpan",
}: {
  cancelHref: string;
  submitLabel?: string;
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-navy/10 pt-5">
      <a
        href={cancelHref}
        className="rounded-lg border border-navy/15 px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-navy/5"
      >
        Batal
      </a>
      <button
        type="submit"
        className="rounded-lg bg-brand-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
      >
        {submitLabel}
      </button>
    </div>
  );
}
