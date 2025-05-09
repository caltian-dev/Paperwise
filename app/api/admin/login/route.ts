import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { login } from "@/lib/admin-auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    const result = await login(email, password)

    if (!result.success) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Set a cookie for authentication
    cookies().set({
      name: "admin_token",
      value: result.token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
