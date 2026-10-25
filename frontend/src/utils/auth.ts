"use server"

import { cookies } from 'next/headers';
import { AcessTokenData } from '@/types'
import { jwtDecode } from "jwt-decode";
import { Backend } from '@/lib/helper';

export type AuthCheckResult = {
  accessToken?: string;
  isAuthenticated: boolean;
  error?: string;
  role?: string;
};


interface DecodedToken {
  exp?: number;
  role?: string;
}



export async function isTokenExpired(accessToken:string) {

  let decoded: DecodedToken;
  try {
    decoded = jwtDecode<DecodedToken>(accessToken);
  } catch (err) {
    console.error(err)
    return true
  }

  if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
    return true
  }

  return false

}

export async function getNewAccessToken() {
  const coookieStore = await cookies();

  const refreshToken = coookieStore.get('refresh');

  const { data, status } = await Backend.post("/auth/token/refresh/",
    {
      body: {
        refresh: refreshToken?.value
      }
    }
  )

  if (status === 200) {
    coookieStore.set("access", data.access)
    coookieStore.set("refresh", data.refresh)

  }

  return data.access


}



export async function checkAuthentication(): Promise<AuthCheckResult> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('access');

    if (!authToken) {
      return {
        isAuthenticated: false,
        error: 'No authentication token found'
      };
    }

    // if (await isTokenExpired(authToken.value)) {
    //   const newToken = await getNewAccessToken();
    //   return {
    //     accessToken: newToken,
    //     isAuthenticated: true
    //   };
    // }
    

    const { role } = jwtDecode<DecodedToken>(authToken.value);

    return {
      accessToken: authToken.value,
      isAuthenticated: true,
      role:role
    };
  } catch (error) {
    console.error(error);
    return {
      isAuthenticated: false,
      error: 'Error checking authentication status'
    };
  }
}



export async function getAccessTokenInfo(): Promise<AcessTokenData> {
  try {
    const { accessToken } = await checkAuthentication();

    if (!accessToken) {
      return {
        user_id: '',
        role: ''
      };
    }

    const tokenData: AcessTokenData = jwtDecode(accessToken);
    return tokenData;
  } catch (error) {
    console.error(error);
    return {
      user_id: '',
      role: ''
    };
  }
}

export async function isAuthenticatedWithRole(role: string): Promise<boolean> {
  const { isAuthenticated, role: userRole } = await checkAuthentication();
  return isAuthenticated && userRole?.toLocaleLowerCase() === role.toLocaleLowerCase() ;
}



export async function isOrganization(): Promise<boolean> {
  return await isAuthenticatedWithRole('organization');
}