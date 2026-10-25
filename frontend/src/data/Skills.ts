"use server"

import { Backend } from "@/lib/helper";
import { Skill } from "@/types";


export async function getSkills(): Promise<{ data : Skill[] , status : number}> {

      try {
            const { data , status} = await Backend.get("skills", {
                  withCredentials: true
            })
            return { data , status}
      }
      catch (error) {
            console.error(error)
            return { data : [] , status : 500}
      }

      


}