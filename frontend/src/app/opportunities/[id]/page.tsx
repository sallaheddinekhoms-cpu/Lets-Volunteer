import OpportunityDetailsPage from '@/components/opportunities/opportunity-details'
import { getOpportunityById } from '@/data/Opportunities'
import { checkAuthentication, isOrganization } from '@/utils/auth'
import React from 'react'




async function OpportunityPage({ params }:{params:Promise<{id:string}>} ) {

  const {id} = await params
  const { data: opportunity } = await getOpportunityById(id)
  const { isAuthenticated, role } = await checkAuthentication()
  const  is_organization  = await isOrganization()
  
  return (
    <div>
      <OpportunityDetailsPage opportunity={opportunity} isAuthenticated={isAuthenticated} is_organization={is_organization} role={role} />
    </div>
  )
}

export default OpportunityPage