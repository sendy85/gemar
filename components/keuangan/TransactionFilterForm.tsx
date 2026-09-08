interface TransactionFilterFormProps {
  action: string;
  categories: readonly string[];
  values: {
    q?: string;
    kategori?: string;
    dari?: string;
    sampai?: string;
    sort?: string;
    jenis?: string;
  };
  showTypeFilter?: boolean;
}

const inputClass =
  "w-full rounded-lg border border-navy/15 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-green";
const labelClass = "mb-1 block text-xs font-medium text-navy";

export function TransactionFilterForm({
  action,
  categories,
  values,
  showTypeFilter = false,
}: TransactionFilterFormProps) {
  return (
    <form
      method="get"
      action={action}
      className="grid gap-3 rounded-card border border-navy/10 bg-white p-4 shadow-softer sm:grid-cols-2 lg:grid-cols-6"
    >
      <div className="sm:col-span-2 lg:col-span-2">
        <label className={labelClass} htmlFor="q">
          Cari keterangan / kode
        </label>
        <input
          id="q"
          type="text"
          name="q"
          defaultValue={values.q}
          placeholder="Cari transaksi..."
          className={inputClass}
        />
      </div>

      {showTypeFilter && (
        <div>
          <label className={labelClass} htmlFor="jenis">
            Jenis Transaksi
          </label>
          <select
            id="jenis"
            name="jenis"
            defaultValue={values.jenis ?? ""}
            className={inputClass}
          >
            <option value="">Semua</option>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="kategori">
          Kategori
        </label>
        <select
          id="kategori"
          name="kategori"
          defaultValue={values.kategori ?? ""}
          className={inputClass}
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="dari">
          Tanggal Mulai
        </label>
        <input
          id="dari"
          type="date"
          name="dari"
          defaultValue={values.dari}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="sampai">
          Tanggal Akhir
        </label>
        <input
          id="sampai"
          type="date"
          name="sampai"
          defaultValue={values.sampai}
          className={inputClass}
        />
      </div>

      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
        <select
          name="sort"
          defaultValue={values.sort ?? "desc"}
          className={inputClass}
          aria-label="Urutkan"
        >
          <option value="desc">Terbaru</option>
          <option value="asc">Terlama</option>
        </select>
      </div>

      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-6 lg:justify-end">
        <a
          href={action}
          className="rounded-lg border border-navy/15 px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-navy/5"
        >
          Reset
        </a>
        <button
          type="submit"
          className="rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-dark"
        >
          Terapkan Filter
        </button>
      </div>
    </form>
  );
}
