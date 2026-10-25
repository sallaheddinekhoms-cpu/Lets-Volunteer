  import React from 'react'
  import { getAccessTokenInfo } from '@/utils/auth'
  import { getOrganizationProfileInfoById } from '@/data/Organization'
  import OrganizationProfileSection from './organization-sections/organization-informations'
  import { getOpportunities } from '@/data/Opportunities'

const OrganizationPage = async () => {
  try {
    const { user_id } = await getAccessTokenInfo()
    
    const [organizationResult, opportunitiesResult] = await Promise.all([
      getOrganizationProfileInfoById(user_id),
      getOpportunities({ organization: user_id })
    ])
    
    const { data: organizationProfile } = organizationResult || { data: null }
    const { data: opportunities } = opportunitiesResult || { data: [] }
     
      return (
        <div>
          {organizationProfile ? (
            <OrganizationProfileSection
              organization={organizationProfile}
              opportunities={opportunities}
            />
          ) : (
            <div>No organization profile found</div>
          )}
        </div>
      )
    } catch (error) {
      console.error('Failed to fetch organization data:', error)
      return <div>Error loading organization profile</div>
    }
  }

  export default OrganizationPage
