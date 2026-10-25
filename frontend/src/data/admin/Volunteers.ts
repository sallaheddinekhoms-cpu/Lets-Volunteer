"use server"

import { Backend } from "@/lib/helper"
import { Volunteer } from "@/types"
import { VolunteerFilters } from "@/types/filters"
import { buildQueryString } from "@/utils/query-builder"

export async function getVolunteers( filters? : Partial<VolunteerFilters> ): Promise<{results:Volunteer[] , count:number}> { 

      const queryString = buildQueryString(filters)


      const {data} = await Backend.get(`volunteers?${queryString}`,{
            withCredentials:true
      })
      console.log(data)
      return {results:data.results , count:data.count}


}



export async function deleteVolunteer(id : string) {
      await Backend.delete(`volunteer/${id}/`,{
            withCredentials:true
      })
}



export async function importVolunteerExcel(
      excel_file : FormData
) {
     const { data , status } = await Backend.post(`import-volunteers/`,{
            withCredentials:true,
            body:excel_file
      })


      return {data , status}


}