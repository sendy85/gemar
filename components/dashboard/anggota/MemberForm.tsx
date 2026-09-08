import {
  FormField,
  FormError,
  FormActions,
  fieldInputClass,
} from "@/components/dashboard/FormField";
import { PhotoUploadField } from "@/components/dashboard/PhotoUploadField";
import type { Division, Member } from "@/types/database";

export function MemberForm({
  action,
  member,
  divisions,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  member?: Member;
  divisions: Division[];
  error?: string;
}) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-card border border-navy/10 bg-white p-6 shadow-softer"
    >
      {member && <input type="hidden" name="id" value={member.id} />}
      <FormError message={error} />

      <PhotoUploadField currentUrl={member?.photo_url} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nama Lengkap" htmlFor="full_name" required>
          <input
            id="full_name"
            name="full_name"
            required
            defaultValue={member?.full_name}
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Jenis Kelamin" htmlFor="gender">
          <select
            id="gender"
            name="gender"
            defaultValue={member?.gender ?? ""}
            className={fieldInputClass}
          >
            <option value="">Pilih</option>
            <option value="laki_laki">Laki-laki</option>
            <option value="perempuan">Perempuan</option>
          </select>
        </FormField>

        <FormField label="Tanggal Lahir" htmlFor="birth_date">
          <input
            id="birth_date"
            name="birth_date"
            type="date"
            defaultValue={member?.birth_date ?? ""}
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Nomor Telepon" htmlFor="phone_number">
          <input
            id="phone_number"
            name="phone_number"
            defaultValue={member?.phone_number ?? ""}
            className={fieldInputClass}
            placeholder="08xxxxxxxxxx"
          />
        </FormField>

        <FormField label="Divisi" htmlFor="division_id">
          <select
            id="division_id"
            name="division_id"
            defaultValue={member?.division_id ?? ""}
            className={fieldInputClass}
          >
            <option value="">Tanpa Divisi</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Status" htmlFor="status" required>
          <select
            id="status"
            name="status"
            defaultValue={member?.status ?? "aktif"}
            className={fieldInputClass}
          >
            <option value="aktif">Aktif</option>
            <option value="tidak_aktif">Tidak Aktif</option>
          </select>
        </FormField>

        <FormField label="Tahun Bergabung" htmlFor="join_year">
          <input
            id="join_year"
            name="join_year"
            type="number"
            min={2000}
            max={2100}
            defaultValue={member?.join_year ?? ""}
            className={fieldInputClass}
            placeholder="2026"
          />
        </FormField>
      </div>

      <FormField label="Alamat" htmlFor="address">
        <textarea
          id="address"
          name="address"
          rows={2}
          defaultValue={member?.address ?? ""}
          className={fieldInputClass}
        />
      </FormField>

      <FormActions cancelHref="/dashboard/anggota" />
    </form>
  );
}
