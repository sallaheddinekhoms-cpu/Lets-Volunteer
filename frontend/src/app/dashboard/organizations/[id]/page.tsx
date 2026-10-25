import OrganizationInfo from '@/components/dashboard/organizations/organization-infos'
import { getOrganizationProfileInfoById } from '@/data/Organization'
import React from 'react'

const OrganizationsPage = async(
      {params} : {params:Promise<{id:string}>}
) => {
      const {id} = await params

      const {data} = await getOrganizationProfileInfoById(id)

  return (
    <>
      {data ? <OrganizationInfo profile={data} /> : <p>Organization profile not found.</p>}
    </>
  )
}

export default OrganizationsPage
