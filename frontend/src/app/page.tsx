import React from "react";
import Hero from "@/components/hero";
import StatsSection from "@/components/landing/stats";
import ServicesHub from "@/components/landing/services-hub";
import MediaGallery from "@/components/landing/media-gallery";
import SolidaritySpotlight from "@/components/landing/solidarity-spotlight";
import ContactSection from "@/components/landing/contact";
import LatestOpportunitiesSection from "@/components/landing/latest-opportunites";
import { getOpportunities } from "@/data/Opportunities";
import TopVolunteersSection from "@/components/landing/top-volunteers";
import PartnersSection from "@/components/landing/partners";
import UrgentNewsTicker, { UrgentAlert } from "@/components/landing/urgent-news-ticker";
import { getTopVolunteers } from "@/data/Volunteer";
import { getPartners } from "@/data/Partners";
import { getVideos } from "@/data/Videos";
import { getAnnouncements } from "@/data/Announcements";

// Force dynamic rendering to prevent static generation issues with API calls
export const dynamic = 'force-dynamic';

export interface Volunteer {
  id: string;
  first_name: string;
  last_name: string;
  hours: number;
  comments?: string;
  rating: number;
}

export interface TopVolunteersProps {
  weeklyVolunteers: Volunteer[];
  monthlyVolunteers: Volunteer[];
  allTimeVolunteers: Volunteer[];
}

// Helper function to safely fetch data with error handling
async function safeFetch<T extends { status?: number; data?: any }>(
  fetchFn: () => Promise<T>,
  defaultValue: T
): Promise<T> {
  try {
    const res = await fetchFn();
    if (res && typeof res.status === 'number' && res.status >= 400) {
      return defaultValue;
    }
    return res;
  } catch (error) {
    console.error(`Error fetching data:`, error);
    return defaultValue;
  }
}

async function App() {
  const statistics = [
    { label: "متطوعين نشطين", value: "5,234+", color: "bg-blue-500" },
    { label: "فرص تطوعية", value: "1,789", color: "bg-green-500" },
    { label: "ساعات تطوع", value: "45,678", color: "bg-purple-500" },
    { label: "مؤسسات شريكة", value: "342", color: "bg-orange-500" },
  ];

  // Fetch all data in parallel to prevent sequential blocking
  const [
    opportunitiesResult,
    topVolunteersResult,
    partnersResult,
    videosResult,
    announcementsResult,
  ] = await Promise.all([
    safeFetch(() => getOpportunities(), { data: [], count: 0, status: 500 }),
    safeFetch(() => getTopVolunteers(), { data: null, status: 500 }),
    safeFetch(() => getPartners(), { data: [], status: 500 }),
    safeFetch(() => getVideos(), { data: [], status: 500 }),
    safeFetch(() => getAnnouncements(), { data: [], status: 500 }),
  ]);

  // Safely extract arrays even if backend returns error objects or non-array data
  const oppsList = Array.isArray(opportunitiesResult?.data) ? opportunitiesResult.data : [];
  const announcementsList = Array.isArray(announcementsResult?.data) ? announcementsResult.data : [];
  const videosList = Array.isArray(videosResult?.data) ? videosResult.data : [];
  const partnersList = Array.isArray(partnersResult?.data) ? partnersResult.data : [];

  const latestOpportunities = oppsList.slice(0, 3);

  // Extract urgent alerts from urgent opportunities
  const urgentOpportunities: UrgentAlert[] = oppsList
    .filter((opp: any) => opp && opp.is_urgent)
    .map((opp: any) => ({
      id: opp.id,
      title: `نداء عاجل: ${opp.title} (${opp.daira || ''})`,
      link: `/opportunities/${opp.id}`,
      wilaya: opp.wilaya,
    }));

  // Map API data to component format safely
  const annoncesImages = announcementsList
    .map((announcement: any) => announcement?.image_url)
    .filter(Boolean);
  const videoUrls = videosList
    .map((video: any) => video?.video_url)
    .filter(Boolean);

  return (
    <>
      <UrgentNewsTicker alerts={urgentOpportunities} />
      <Hero />
      <StatsSection statistics={statistics} />
      <ServicesHub />
      <LatestOpportunitiesSection latestOpportunities={latestOpportunities} />
      <MediaGallery
        annoncesImages={annoncesImages}
        videoUrls={videoUrls}
        rawVideos={videosList}
        rawAnnouncements={announcementsList}
      />
      <SolidaritySpotlight />
      <TopVolunteersSection
        weeklyVolunteers={topVolunteersResult?.data?.weekly_volunteers || []}
        monthlyVolunteers={topVolunteersResult?.data?.monthly_volunteers || []}
        allTimeVolunteers={topVolunteersResult?.data?.all_time_volunteers || []}
      />
      <PartnersSection partners={partnersList} />
      <ContactSection />
    </>
  );
}

export default App;
