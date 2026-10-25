"use server"

import { Backend } from "@/lib/helper"
import { Organization } from "@/types"
import { OrganizationFilters } from "@/types/filters"
import { buildQueryString } from "@/utils/query-builder"

export async function getOrganizations(filters? :Partial<OrganizationFilters>  ): Promise<{results:Organization[],count:number}>{ 

      const queryString = buildQueryString(filters)

      const {data} = await Backend.get(`organizations?${queryString}`,{
            withCredentials:true
      })
      console.log(data)
      return {results:data.results , count:data.count} 


}


export async function deleteOrganization(id:string): Promise<void>{
      await Backend.delete(`organizations/${id}`,{
            withCredentials:true
      })

}

export async function confirmOrganization(id:string): Promise<void>{
      await Backend.patch(`organizations/${id}/confirm/`,{},{
            withCredentials:true
      })
}

export async function unconfirmOrganization(id:string): Promise<void>{
      await Backend.patch(`organizations/${id}/unconfirm/`,{},{
            withCredentials:true
      })
}