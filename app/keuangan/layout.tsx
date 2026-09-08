import { KeuanganTabs } from "@/components/keuangan/KeuanganTabs";

export default function KeuanganLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <KeuanganTabs />
      <div className="container-app py-12">{children}</div>
    </div>
  );
}
