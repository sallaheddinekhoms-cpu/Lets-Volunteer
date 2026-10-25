import { checkAuthentication } from "@/utils/auth";
import { BASE_URL } from "./constant";

interface FetchOptions {
      body?: any;
      withCredentials?: boolean;
      headers?: HeadersInit;
      tags?: string[];
      revalidateTag?: string;
}

    
export async function myFetch(
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
      endpoint: string,
      options: FetchOptions
    ) {
      const { accessToken } = await checkAuthentication();
    
      // Determine the body and headers
      let body: BodyInit | null = null;
      const headers: Record<string, string> = {
        ...(options.withCredentials && accessToken) && { "Authorization": `Bearer ${accessToken}` },
        ...options.headers as Record<string, string>,
      };
    
      if (options.body) {
        if (options.body instanceof FormData) {
          // If the body is FormData, let the browser set the Content-Type header
          body = options.body;
        } else {
          // Otherwise, assume it's JSON and stringify it
          body = JSON.stringify(options.body);
          headers['Content-Type'] = 'application/json';
        }
      }
    
      return fetch(`${BASE_URL}/${endpoint}`, {
        method: method,
        headers: headers,
        body: body,
        next: {
          tags: options.tags
        }
      });
    }