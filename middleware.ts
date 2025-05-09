import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if the path starts with /admin but is not the admin login page
  const isAdminPath = path.startsWith("/admin") && !path.startsWith("/admin-login")

  // If it's not an admin path, allow the request
  if (!isAdminPath) {
    return NextResponse.next()
  }

  // For admin paths, we'll let the client-side check handle authentication
  // This middleware just ensures /admin-login is accessible
  return NextResponse.next()
}

// Only run middleware on admin routes
export const config = {
  matcher: ["/admin/:path*"],
}
