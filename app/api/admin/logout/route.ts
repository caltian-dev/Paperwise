import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  // Clear the admin token cookie
  cookies().delete("admin_token")

  // Redirect to the homepage
  return NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL || "http://localhost:3000"))
}
