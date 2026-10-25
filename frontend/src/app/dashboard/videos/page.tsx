import VideosList from '@/components/dashboard/videos/videos-list'
import { getVideos } from '@/data/Videos'
import React from 'react'

export const dynamic = 'force-dynamic'

const VideosPage = async() => {

  const { data: videos } = await getVideos()

  return (
    <div>
      <VideosList videos={videos || []} />
    </div>
  )
}

export default VideosPage
