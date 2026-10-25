"use server"

import { Backend } from "@/lib/helper";
import { Category } from "@/types";

export async function getCategories() : Promise<{data:Category[],status:number}> {

      const {data ,status} = await Backend.get("categories",{
            withCredentials:false,
            tags:["categories"]
      })

      // console.log(data)

      return {data,status}


}
