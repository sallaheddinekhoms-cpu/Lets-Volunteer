"use server"

import { Backend } from "@/lib/helper"


export async function getDashboardStats() {
      const { data } = await Backend.get("stats/dashboard",{
            withCredentials: true
      });
      
      console.log("Dashboard Stats",data)
      return data;
}

export async function getVolunteerStats() : Promise<any> {
      const { data } = await Backend.get("stats/volunteers",{
            withCredentials: true
      });
      

      return data;
}

export async function getOrgStats() {
      const { data } = await Backend.get("stats/organizations",{
            withCredentials: true
      });
      

      return data;
}


export async function getOppStats() {
      const { data } = await Backend.get("stats/opportunities",{
            withCredentials: true
      });
      

      return data;
}


export async function getParticipationStats() {
      const { data } = await Backend.get("stats/participations",{
            withCredentials: true
      });
      

      return data;
}


export async function getAidsStats() {
      const { data } = await Backend.get("stats/aids",{
            withCredentials: true
      });
      

      return data;
}




