"use server"

import { Backend } from "@/lib/helper"
import { Partner } from "@/types"
import { updateTag } from "next/cache"



export async function getPartners() {
      const { data , status } = await Backend.get("partners",
            {
                  withCredentials: true,
                  tags:['partners']
            }
      )

      return { data , status }
}


export async function addPartner(partner: Omit<Partner, "id">) {
      const { data } = await Backend.post("partners/",{
            withCredentials:true,
            body:partner
      })

      updateTag('partners')
      return data
}


export async function removePartner(partner_id:number){
      const { data} = await Backend.delete(`partners/${partner_id}/`,
            {
                  withCredentials:true
            }
      )

      updateTag('partners')

      return data
}


export async function updatePartner(partner_id:number,partner: Partial<Partner>) {
      const { data } = await Backend.patch(`partners/${partner_id}/`,partner,{
            withCredentials:true
      })

      updateTag('partners')

      return data
}