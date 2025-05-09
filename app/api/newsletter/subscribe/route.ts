import { type NextRequest, NextResponse } from "next/server"
import { addSubscriberToMailerLite } from "@/lib/mailerlite"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, message: "Valid email is required" }, { status: 400 })
    }

    const result = await addSubscriberToMailerLite(email)

    if (result.success) {
      if (result.already_subscribed) {
        return NextResponse.json({
          success: true,
          message: "You're already subscribed! We'll send you the checklist again.",
        })
      }
      return NextResponse.json({
        success: true,
        message: "Thank you for subscribing! Check your email for your free legal checklist.",
      })
    } else {
      console.error("MailerLite error:", result.error)
      return NextResponse.json(
        { success: false, message: "Failed to subscribe. Please try again later." },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
