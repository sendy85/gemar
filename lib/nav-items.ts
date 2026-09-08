export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavLink[];
}

// Struktur menu lengkap sesuai spesifikasi.
export const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/" },
  {
    label: "Profil",
    children: [
      { label: "Tentang Organisasi", href: "/profil/tentang" },
      { label: "Sejarah", href: "/profil/sejarah" },
      { label: "Visi & Misi", href: "/profil/visi-misi" },
      { label: "Struktur Organisasi", href: "/profil/struktur" },
    ],
  },
  {
    label: "Kegiatan",
    children: [
      { label: "Agenda", href: "/agenda" },
      { label: "Daftar Kegiatan", href: "/kegiatan" },
      { label: "Pengumuman", href: "/pengumuman" },
    ],
  },
  {
    label: "Organisasi",
    children: [
      { label: "Data Anggota", href: "/organisasi/anggota" },
      { label: "Data Pengurus", href: "/organisasi/pengurus" },
      { label: "Divisi", href: "/organisasi/divisi" },
    ],
  },
  {
    label: "Keuangan",
    children: [
      { label: "Dashboard Keuangan", href: "/keuangan" },
      { label: "Pemasukan", href: "/keuangan/pemasukan" },
      { label: "Pengeluaran", href: "/keuangan/pengeluaran" },
      { label: "Laporan Keuangan", href: "/keuangan/laporan" },
    ],
  },
  { label: "Galeri", href: "/galeri" },
  { label: "Dokumen", href: "/dokumen" },
];
