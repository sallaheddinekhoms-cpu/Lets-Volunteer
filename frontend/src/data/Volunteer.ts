"use server"

import { Backend } from "@/lib/helper"
import { Volunteer } from "@/types"
import { updateTag } from 'next/cache';

export async function getVolunteerProfileInfoById(volunteerId: string):Promise <{data: Volunteer | null, status: number}> {

      const { data  , status } = await Backend.get(
            `volunteer/${volunteerId}`, {
                  withCredentials: true,
                  tags: ["volunteer"]
            }
      )


      
      return { data , status }


}


export async function updateVolunteerProfile(volunteerId:string , data: Volunteer):Promise<{data: Volunteer | null, status: number}> {

      const formData = new FormData()
      for (const [key, value] of Object.entries(data)) {
            if (key === "avatar" && value instanceof File) {
                  formData.append(key, value)
            }
            else if (key === "skills") {
                  // Skills field - send skill IDs if present
                  if (Array.isArray(value) && value.length > 0) {
                        for (const skill of value) {
                              formData.append("skills", skill.skill.id)
                        }
                  }
                  // If no skills, don't send the field at all (it's optional now)
            }
            else if (key !== "avatar"){
                  // Only append non-null, non-undefined values
                  // Allow empty strings to clear fields
                  if (value !== null && value !== undefined) {
                        formData.append(key, String(value))
                  }
            }
      }
      

      const { data: updatedData , status } = await Backend.patch(
            `volunteer/${volunteerId}/`, formData, {
                  withCredentials: true
            }
      )
      console.log("Updated Data", updatedData)
      updateTag("volunteer")


      return { data: updatedData , status }

}


export async function getVolunteerStats(volunteerId: string):Promise<{data: any | null, status: number}> {

      const { data , status } = await Backend.get(
            `volunteer-stats/${volunteerId}`, {
                  withCredentials: true
            }
      )

      return { data , status }

}


export async function getTopVolunteers():Promise<{data: any | null, status: number}> {
      const { data , status } = await Backend.get(
            "top-volunteers", {
            }
      )

      return {data , status}

}