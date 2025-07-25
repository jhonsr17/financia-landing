import { NextRequest, NextResponse } from "next/server";
import { getUser, updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const protectedRoutesList = ["/dashboard"],
    authRoutesList = ["/login", "/register"];
  const currentPath = new URL(request.url).pathname;

  // Excluir server actions del middleware
  if (currentPath.startsWith('/_next/') || currentPath.includes('/api/')) {
    return NextResponse.next();
  }

  const {
    data: { user },
  } = await getUser(request, NextResponse.next());
  
  if (protectedRoutesList.includes(currentPath) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  if (authRoutesList.includes(currentPath) && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}; 