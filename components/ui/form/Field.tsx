import { cn } from "@/lib/utils";

const baseFieldClass =
  "w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-green disabled:cursor-not-allowed disabled:bg-navy/5";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

function FieldWrapper({
  label,
  htmlFor,
  required,
  hint,
  className,
  children,
}: FieldWrapperProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-navy">
        {label}
        {required && <span className="ml-0.5 text-brand-red">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  wrapperClassName?: string;
};

export function InputField({
  label,
  hint,
  id,
  required,
  className,
  wrapperClassName,
  ...props
}: InputFieldProps) {
  return (
    <FieldWrapper
      label={label}
      htmlFor={id!}
      required={required}
      hint={hint}
      className={wrapperClassName}
    >
      <input
        id={id}
        required={required}
        className={cn(baseFieldClass, className)}
        {...props}
      />
    </FieldWrapper>
  );
}

type TextareaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  wrapperClassName?: string;
};

export function TextareaField({
  label,
  hint,
  id,
  required,
  className,
  wrapperClassName,
  rows = 4,
  ...props
}: TextareaFieldProps) {
  return (
    <FieldWrapper
      label={label}
      htmlFor={id!}
      required={required}
      hint={hint}
      className={wrapperClassName}
    >
      <textarea
        id={id}
        required={required}
        rows={rows}
        className={cn(baseFieldClass, "resize-y", className)}
        {...props}
      />
    </FieldWrapper>
  );
}

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  wrapperClassName?: string;
  children: React.ReactNode;
};

export function SelectField({
  label,
  hint,
  id,
  required,
  className,
  wrapperClassName,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <FieldWrapper
      label={label}
      htmlFor={id!}
      required={required}
      hint={hint}
      className={wrapperClassName}
    >
      <select
        id={id}
        required={required}
        className={cn(baseFieldClass, "bg-white", className)}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  );
}

export function FormErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="rounded-lg bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
      {message}
    </div>
  );
}
