"use server"

import { Backend } from "@/lib/helper";
import { Article } from "@/types/articles";
import { buildQueryString } from "@/utils/query-builder";



export async function getArticles(limit?:number,filters?:{page:number}): Promise<{data:Article[] , count:number}> {

    const queryString = buildQueryString(filters);
      try {
        if(limit){

          const {data} = await Backend.get(`articles/?limit=${limit}`, {
            withCredentials: false
          });

          return { data:data.results , count:data.count };


        }else{

       
        const { data } = await Backend.get(`articles/?${queryString}`, {
          withCredentials: false
        });
        return { data:data.results , count:data.count};
      }
        
      } catch (error) {
        console.error('Error fetching articles:', error);
        throw error; 
      }
    }



export async function getArticle(id:string): Promise<{data:Article}> {
      try {
        const { data } = await Backend.get(`articles/${id}`, {
          withCredentials: false
        });
        return { data };
      } catch (error) {
        console.error('Error fetching article:', error);
        throw error; 
      }
    }