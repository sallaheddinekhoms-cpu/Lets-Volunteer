"use server"

import { Backend } from "@/lib/helper"
import { Category } from "@/types"
import { updateTag } from "next/cache"


export async function addCategory(data: Omit<Category, "id">) {
      await Backend.post("categories/", {
            withCredentials: true,
            body:data
      })

      updateTag("categories")

}

export async function deleteCategory(id: string) {
      await Backend.delete(`categories/${id}/`, {
            withCredentials: true
      })

      updateTag("categories")
}

export async function editCategory(id:string , data: Omit<Category, "id">) {
      await Backend.patch(`categories/${id}/`, data, {
            withCredentials: true
      })

      updateTag("categories")
}