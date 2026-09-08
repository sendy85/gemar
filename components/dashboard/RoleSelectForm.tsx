"use client";

import { useRef } from "react";
import { fieldInputClass } from "@/components/dashboard/FormField";
import type { UserRole } from "@/types/database";

export function RoleSelectForm({
  userId,
  currentRole,
  action,
  disabled,
}: {
  userId: string;
  currentRole: UserRole;
  action: (formData: FormData) => void | Promise<void>;
  disabled?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        disabled={disabled}
        onChange={() => formRef.current?.requestSubmit()}
        className={`${fieldInputClass} max-w-[160px]`}
      >
        <option value="admin">Admin</option>
        <option value="pengurus">Pengurus</option>
        <option value="anggota">Anggota</option>
      </select>
    </form>
  );
}
