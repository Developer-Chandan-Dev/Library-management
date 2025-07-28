import { NextRequest, NextResponse } from "next/server";
import { account } from "./lib/appwrite/appwrite";

export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // Retrieve the session token from the incoming request's cookies
  const sessionToken = request.cookies.get("session")?.value;

  //   if (isAdminRoute) {
  //     if (!sessionToken) {
  //       // No session token, redirect to login
  //       return NextResponse.redirect(new URL("/sign-in", request.url));
  //     }

  //     try {
  //       // Validate the session token with Appwrite
  //       const user = await account.get(); // Or use a custom validation function if needed
  //       // Assuming 'account.get()' successfully retrieves the user if the session is valid

  //       if (!user) {
  //         // Appwrite validation failed, redirect to login
  //         return NextResponse.redirect(new URL("/sign-in", request.url));
  //       }

  //       // If the session is valid, proceed
  //       return NextResponse.next();

  //     } catch (error) {
  //       console.error("Appwrite session validation error:", error);
  //       // Handle the error (e.g., redirect to login or show an error page)
  //       return NextResponse.redirect(new URL("/sign-in", request.url));
  //     }
  //   }

  //   // For non-admin routes or if not an admin route, proceed
  //   return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
