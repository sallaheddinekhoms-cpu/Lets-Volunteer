import { NextRequest, NextResponse } from "next/server";
import { ProfileRoutes } from "./utils/routes";
import { checkAuthentication, isAuthenticatedWithRole } from "./utils/auth";





export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/auth");
  const isProfileRoute = ProfileRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith("/dashboard");

  const { isAuthenticated } = await checkAuthentication();

  const isAdmin = await isAuthenticatedWithRole("admin");

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  

  if ( isProfileRoute && isAdmin  )  {
    console.log("isProfileRoute && isAdmin")
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }



   if ((isProfileRoute ) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isAuthRoute && isAuthenticated ) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  





  return NextResponse.next();
}
