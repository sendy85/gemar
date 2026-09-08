import { Hero } from "@/components/home/Hero";
import { StatsSection } from "@/components/home/StatsSection";
import { AnnouncementsSection } from "@/components/home/AnnouncementsSection";
import { AgendaSection } from "@/components/home/AgendaSection";
import { ActivitiesSection } from "@/components/home/ActivitiesSection";
import { AboutSection } from "@/components/home/AboutSection";
import {
  getHomeStats,
  getFeaturedAnnouncements,
  getUpcomingAgendas,
  getRecentActivities,
} from "@/lib/data/home";

// Data organisasi berubah cukup sering (pengumuman, agenda, statistik),
// jadi halaman ini dirender dinamis agar selalu menampilkan data terbaru
// dari Supabase, bukan hasil cache statis saat build.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, announcements, agendas, activities] = await Promise.all([
    getHomeStats(),
    getFeaturedAnnouncements(3),
    getUpcomingAgendas(3),
    getRecentActivities(3),
  ]);

  return (
    <div>
      <Hero />
      <StatsSection stats={stats} />
      <AnnouncementsSection announcements={announcements} />
      <AgendaSection agendas={agendas} />
      <ActivitiesSection activities={activities} />
      <AboutSection />
    </div>
  );
}