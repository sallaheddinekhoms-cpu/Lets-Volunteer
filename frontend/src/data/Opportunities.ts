"use server"

import { Backend } from "@/lib/helper";
import { Opportunity } from "@/types";
import { OpportunityFilters } from "@/types/filters";
import { OpportunityForCardList } from "@/types/opportunity";
import { buildQueryString } from "@/utils/query-builder";
import { updateTag } from "next/cache";

export async function getOpportunities(filters? : Partial<OpportunityFilters>):Promise<{data:OpportunityForCardList[]
      ,count:number, status:number}> {

      const queryString = buildQueryString(filters)
      const { data , status } = await Backend.get(`opportunities?${queryString}`, {
            withCredentials:true,
            tags:["opportunities"]
      })

      
      return { data: data.results, count:data.count , status }     

}


export async function getOpportunityById(id:string):Promise<{data:Opportunity, status:number}> {
      const { data , status } = await Backend.get(`opportunities/${id}`, {
            withCredentials:true,
            tags:["opportunities"]
      })
      
      return { data: data, status }     

}


export async function addOpportunity(opportunity:FormData):Promise<{data:Opportunity, status:number}> {
      
      const { data , status } = await Backend.post(`opportunities/`, {
            withCredentials:true,
            body:opportunity
      })
      console.log("data",data)
      return { data: data, status }     

}


export async function deleteOpportunity(id: string): Promise<{ status: number }> {
      try {
        const { status } = await Backend.delete(`opportunities/${id}/`, {
          withCredentials: true,
        });
    
        if (status !== 204) { 
          throw new Error(`Failed to delete opportunity. Status: ${status}`);
        }
        

        updateTag("opportunities");
    
        return { status };
      } catch (error) {
        throw error; 
      }
    }
    


export async function updateOpportunity(id:string, opportunity:any):Promise<{data:Opportunity, status:number}> {
      
      const { data , status } = await Backend.patch(`opportunities/${id}/`, opportunity, {
            withCredentials:true
      })
      console.log("data",data)
      updateTag("opportunities");
      return { data: data, status }     

}