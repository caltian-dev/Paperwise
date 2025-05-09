import { NextResponse } from "next/server"
import { createUser } from "@/lib/user-utils"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email, and password are required" }, { status: 400 })
    }

    // Create the user
    const user = await createUser({ name, email, password })

    // Start onboarding sequence
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/onboarding/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        name: user.name,
      }),
    })

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      userId: user.id,
    })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ success: false, error: "Failed to register user" }, { status: 500 })
  }
}
