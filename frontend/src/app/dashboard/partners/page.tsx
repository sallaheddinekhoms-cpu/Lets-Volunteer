import PartnersList from '@/components/dashboard/partners/partners-list'
import { getPartners } from '@/data/Partners'
import React from 'react'

const PartnersPage = async() => {

      const { data:partners} = await getPartners()

  return (
    <div>
      <PartnersList partners={partners} />
    </div>
  )
}

export default PartnersPage
