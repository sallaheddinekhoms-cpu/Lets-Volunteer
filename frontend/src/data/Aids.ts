"use server"

import { Backend } from "@/lib/helper";
import { Aid, AidType } from "@/types/aids";
import { AidsFilters } from "@/types/filters";
import { buildQueryString } from "@/utils/query-builder";
import { updateTag } from "next/cache";


export async function getAidsTypes() {
      try {
        const { data } = await Backend.get("aid_type/", {
          withCredentials: true,
          tags: ["aids-types"]
        });
        return { data };
      } catch (error) {
        console.error('Error fetching aid types:', error);
        throw error; 
      }
    }

export async function getAidType(id:string): Promise<{data:AidType}> {
      const { data } = await Backend.get(`aid_type/${id}/`,{
            withCredentials : true,
            tags : ["aids-types"]
      })


      return {data}
}

export async function addAidType(aid: Partial<AidType>) : Promise<{data:Aid , status:number}> {
      const { data , status } = await Backend.post("aid_type/",{
            withCredentials : true,
            body : aid
      })

      updateTag("aids-types")

      return {data , status}

}

export async function updateAidType(aid: Partial<AidType>) : Promise<{data:Aid , status:number}> {
      const { data , status } = await Backend.patch(`aid_type/${aid.id}/`,aid,{
            withCredentials : true
                })

      updateTag("aids-types")

      return {data , status}

}

export async function deleteAidType(id:string) : Promise<{data:Aid , status:number}> {
      const { data , status } = await Backend.delete(`aid_type/${id}/`,{
            withCredentials : true
      })
      updateTag("aids-types")
      return {data , status}
}


export async function getAids(filters? : AidsFilters) : Promise<{data:Aid[] , count:number}> {

      const queryString = buildQueryString(filters)

      console.log("queryString",queryString)

      const { data } = await Backend.get(`aid?${queryString}`,
            {
                  withCredentials : true,
                  tags : ["aids"]
            }
      )

      console.log("data",data)




      return  {data:data.results , count:data.count}
}


export async function addBinificary(aid:Partial<Aid>) : Promise<{data:Aid , status:number}> {
    
   const { data , status } = await Backend.post("aid/",{
    withCredentials : true,
    body : aid
   })
   
   updateTag("aids")

   console.log("status",status)
    return {data , status}

}


export async function downloadTemplate(): Promise<Response> {
  
  return await Backend.get("aid/download_template/beneficiaries", {
    withCredentials: true,
    returnFullResponse: true // This will return the raw Response object
  }) as unknown as Promise<Response>;


}


export async function uploadExcelFile(formData: FormData) {
      const { data } = await Backend.post("upload/beneficiaries", {
            withCredentials: true,
            body: formData
      });

      updateTag("aids")
      return data;
}

