


import { getVolunteerProfileInfoById, getVolunteerStats } from '@/data/Volunteer'
import { getAccessTokenInfo } from '@/utils/auth'
import React from 'react'
import ProfileSections from './volunteer-tabs-sections'
import { getParticipations } from '@/data/Participations'
import { getSkills } from '@/data/Skills'

async function VolunteerProfilePage() {

  const { user_id } = await getAccessTokenInfo() 
  

  const [
    { data: volunteer },
    { data: participations },
    { data: skills },
    { data: volunteerStats }
  ] = await Promise.all([
    getVolunteerProfileInfoById(user_id),
    getParticipations(),
    getSkills(),
    getVolunteerStats(user_id)
  ])
  

  return (
    <>
    {volunteer && 
    <ProfileSections  
      volunteer={volunteer} 
      participations={participations} 
      skills={skills}
      stats={volunteerStats}
    />}
    </>
  )
}

export default VolunteerProfilePage
