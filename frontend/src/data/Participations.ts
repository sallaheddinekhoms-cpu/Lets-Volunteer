"use server"

import { Backend } from "@/lib/helper"
import { ParticipationsFilters } from "@/types/filters"
import { ParticipationForOrganizationStats } from "@/types/participation"
import { buildQueryString } from "@/utils/query-builder"
import { updateTag } from "next/cache"


export async function participate(opportuniy_id : string):Promise<{data:any, status:number}> {

      try {
            const { data, status } = await Backend.post(
                  `participation/`, {
                        withCredentials: true,
                        body:{
                              opportunity:opportuniy_id
                        }
                  }     
            )
      
            updateTag("opportunities")
            return { data, status } 

      } catch (error:any) {
            console.log("Participate Error", error)
            throw error.response || error;
      
      }
      

}





export async function getParticipations(filters? : Partial<ParticipationsFilters> ):Promise<{data:any, status:number}> {

      const queryString = buildQueryString(filters)

      const { data, status } = await Backend.get(
            `participation/?${queryString}`, {
                  withCredentials: true,
                  tags:["participations"]
            }
      )

      console.log("Participations", data)


      return { data:data.results, status } 

}

export async function cancelParticipation(participation_id : string):Promise<{data:any, status:number}> {
      const { data, status } = await Backend.delete(
            `participation/${participation_id}/`, {
                  withCredentials: true
            }
      )

      updateTag("participations")

      return { data, status } 

}


export async function changeStatusofParticipation(participation_id : number, participation_status : string):Promise<{data:any, status:number}> {
      
      console.log("Participation Status", participation_status)
      const { data, status } = await Backend.patch(
            `participation/${participation_id}/`,
            {
                  status:participation_status
            }, {
                  withCredentials: true,
                  
            }
      )


      updateTag("participations")

      return { data, status } 

}



export async function participationStats(participation : Partial<ParticipationForOrganizationStats> , selectedParticipation:number):Promise<{data:any, status:number}> {
      
      console.log("Participation Stats", participation)
      
      const { data, status } = await Backend.patch(
            `participation/${selectedParticipation}/`,participation, {
                  withCredentials: true            }
      )

      return { data, status } 

}



export async function sendInvitaions ( volunteer_ids: string[] , opportuniy_id:string):Promise<{data:any, status:number}> {
      const { data, status } = await Backend.post(
            `invite-volunteer/${opportuniy_id}/`, {
                  withCredentials: true,
                  body:{
                        volunteer_ids:volunteer_ids
                  }
            }
      )

      return { data, status } 
}

export async function completeParticipationWithValuation(
      participation_id: number,
      dataPayload: {
            hours_worked: number;
            rating: number;
            skill_level: "general" | "specialist" | "lead";
            provided_transport: boolean;
            provided_equipment: boolean;
            provided_donation: boolean;
            organization_feedback?: string;
      }
): Promise<{ data: any; status: number }> {
      const { data, status } = await Backend.post(
            `participation/${participation_id}/complete/`,
            {
                  withCredentials: true,
                  body: dataPayload
            }
      );
      updateTag("participations");
      return { data, status };
}

export async function rateOrganizationAsVolunteer(
      participation_id: number | string,
      rating: number,
      feedback?: string
): Promise<{ data: any; status: number }> {
      const { data, status } = await Backend.post(
            `participation/${participation_id}/rate-organization/`,
            {
                  withCredentials: true,
                  body: { rating, feedback }
            }
      );
      updateTag("participations");
      return { data, status };
}

export async function getVolunteerCredits(): Promise<any> {
      try {
            const { data } = await Backend.get("volunteers/my-credits/", {
                  withCredentials: true
            });
            return data;
      } catch (err) {
            console.error("Error fetching volunteer credits:", err);
            return null;
      }
}
