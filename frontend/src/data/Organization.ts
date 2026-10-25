"use server"

import { Backend } from "@/lib/helper";
import { OrganizationProfile } from "@/types/organization";

export async function getOrganizationProfileInfoById(organizationId: string):Promise <{data: OrganizationProfile | null, status: number}> {
    
      const { data  , status } = await Backend.get(
            `organization/${organizationId}`, {
                  withCredentials: true,
                  tags: ["organization"]
            }
      )

      
      return { data , status }


}


export async function updateOrganization(updatedOrganization: FormData): Promise<void> {
      const id = updatedOrganization.get("id"); 
      if (!id) {
          throw new Error("Organization ID is required");
      }
  
      const{data} = await Backend.patch(
          `organization/${id}/`,
          updatedOrganization,
          {
              withCredentials: true,
              tags: ["organization"]
          }
      );


      console.log("data", data)
  }
  
