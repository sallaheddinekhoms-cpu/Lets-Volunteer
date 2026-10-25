import { myFetch } from "./api";


interface BackendResponse {
      data?: any;
      status: number;
}

interface GetFetchOptions {
      withCredentials?: boolean,
      headers?: HeadersInit,
      tags?: string[],
      returnFullResponse?: boolean
}

interface PostFetchOptions {
      content_type?: string,
      withCredentials?: boolean,
      headers?: HeadersInit,
      tags?: string[],
      body?: any
}

export class Backend {

      static async get(endpoint: string, options: GetFetchOptions): Promise<BackendResponse> {
            const response = await myFetch(
                  "GET",
                  endpoint,
                  {
                        withCredentials: options.withCredentials,
                        headers: options.headers,
                        tags: options.tags
                  }
            )
            
            if (options.returnFullResponse) {
                  return response;
            }
                
            return Backend.handleResponse(response);
      }

      static async post(endpoint: string, options: PostFetchOptions): Promise<BackendResponse> {
            const response = await myFetch(
                  "POST",
                  endpoint,
                  {
                        withCredentials: options.withCredentials,
                        headers: {
                              ...options.headers
                        },
                        tags: options.tags,
                        body: options.body
                  }
            )
            return Backend.handleResponse(response);
      }


      static async patch(endpoint: string, data: any, options: PostFetchOptions): Promise<BackendResponse> {
            const response = await myFetch(
                  "PATCH",
                  endpoint,
                  {
                        withCredentials: options.withCredentials,
                        headers: {
                              // "Content-Type": options.content_type || "application/json",
                              ...options.headers
                        },
                        tags: options.tags,
                        body: data
                  }
            )
            return Backend.handleResponse(response);
      }


      static async delete(endpoint: string, options: PostFetchOptions): Promise<BackendResponse> {
            const response = await myFetch(
                  "DELETE",
                  endpoint,
                  {
                        withCredentials: options.withCredentials,
                        headers: {
                              "Content-Type": options.content_type || "application/json",
                              ...options.headers
                        },
                        tags: options.tags,
                        body: options.body
                  }
            )

            // For DELETE requests, return status without parsing body
            // Some DELETE responses may not have a body
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                  return { status: response.status };
            }

            return Backend.handleResponse(response);
      }

      /**
       * Safely handles response parsing to prevent "read on closed response body" errors
       */
      private static async handleResponse(response: Response): Promise<BackendResponse> {
            try {
                  // Check if response is ok before parsing
                  if (!response.ok) {
                        // Try to parse error body, but don't fail if we can't
                        let errorData;
                        try {
                              errorData = await response.json();
                        } catch {
                              errorData = { message: response.statusText };
                        }
                        return {
                              data: errorData,
                              status: response.status
                        };
                  }

                  // Check content type to determine how to parse
                  const contentType = response.headers.get('content-type');
                  const contentLength = response.headers.get('content-length');
                  
                  // Handle empty responses
                  if (contentLength === '0' || response.status === 204) {
                        return { status: response.status };
                  }

                  // Clone the response before reading to avoid "body used" errors
                  // This allows the response to be read multiple times if needed
                  const clonedResponse = response.clone();
                  
                  let data;
                  if (contentType?.includes('application/json')) {
                        data = await clonedResponse.json();
                  } else {
                        data = await clonedResponse.text();
                  }

                  return {
                        data,
                        status: response.status
                  };
            } catch (error) {
                  console.error('Error parsing response:', error);
                  return {
                        data: null,
                        status: response.status
                  };
            }
      }




}