import { ProfilTabs } from "@/components/profil/ProfilTabs";

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ProfilTabs />
      <div className="container-app py-12">{children}</div>
    </div>
  );
}
