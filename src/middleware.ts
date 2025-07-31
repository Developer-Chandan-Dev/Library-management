import { NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite";

export async function middleware(request: NextRequest) {
  const dashboardPath = "/dashboard";

  // Skip non-dashboard routes
  if (!request.nextUrl.pathname.startsWith(dashboardPath)) {
    return NextResponse.next();
  }

  try{
    // 1. Get an account
    const { account } = await createSessionClient();

    if (!account) {
      return redirectToLogin(request, "appwrite-session");
    }

    // 2. Get user directly from Appwrite
    const currentUser = await account.get();

    // 3. Check the admin label (critical security check)
    const isAdmin = currentUser.labels?.includes('admin');

    if (!isAdmin) {
      return new NextResponse("Access Denied", { status: 403 });
    }

    // 4. Admin detected - allow access
    return NextResponse.next();

  }catch(error){
    console.log(error);
    return redirectToLogin(request, 'appwrite-session');
  }
}

// Helper function for login redirect
function redirectToLogin(request: NextRequest, cookieName: string) {
  const response = NextResponse.redirect(new URL('/sign-in', request.url));
  response.cookies.delete(cookieName);
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
