import AnnouncementsList from '@/components/dashboard/announcements/announcements-list'
import { getAnnouncements } from '@/data/Announcements'
import React from 'react'

export const dynamic = 'force-dynamic'

const AnnouncementsPage = async() => {

  const { data: announcements } = await getAnnouncements()

  return (
    <div>
      <AnnouncementsList announcements={announcements || []} />
    </div>
  )
}

export default AnnouncementsPage
