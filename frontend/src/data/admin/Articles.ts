"use server"

import { Backend } from "@/lib/helper"
import { Article } from "@/types/articles"


export async function getArticles() : Promise<Article[]> {

      const { data } = await Backend.get('articles',
            {
                  withCredentials:false
            }
      ) 



      return data

}


export async function addArticle (data:FormData) : Promise<Article> {

      // console.log("data",data)

      console.log([...data.entries()]);


      const { data:article } = await Backend.post('articles/',
            {
                  withCredentials:true,
                  body:data
            }
      )


      return article

}


export async function deleteArticle(id:string) : Promise<void> {
      await Backend.delete(`articles/${id}/`,
            {
                  withCredentials:true
            }
      )
}