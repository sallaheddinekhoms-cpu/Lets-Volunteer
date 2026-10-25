import React from 'react';
import BackgroundDecorations from '@/components/background-decorations';
import VolunteerProfileHeader from '@/components/volunteer/volunteer-profile-header';
import VolunteerProfileStatsGrid from '@/components/volunteer/volunteer-profile-stats-grid';
import VolunteerFeedback from '@/components/volunteer/volunteer-feedback';
import { getVolunteerStats } from '@/data/Volunteer';






export  default async function VolunteerProfile(
      {params} : {params:Promise<{id:string}>} 
) {
try {
      const {id} = await params 
      const {data:volunteerData} = await getVolunteerStats(id)

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      <BackgroundDecorations>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            
            <VolunteerProfileHeader volunteerData={volunteerData} />

            <VolunteerProfileStatsGrid volunteerData={volunteerData} />


            <VolunteerFeedback volunteerData={volunteerData} />
            
          </div>
        </div>
      </BackgroundDecorations>
    </div>
  );
} catch (error: any) {
    return <div>Something went wrong: {error.message}</div>
  }
}