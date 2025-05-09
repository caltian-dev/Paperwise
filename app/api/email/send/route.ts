import { type NextRequest, NextResponse } from "next/server"
import { sendTransactionalEmail } from "@/lib/mailerlite"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, templateId, variables } = await request.json()

    if (!to || !to.includes("@")) {
      return NextResponse.json({ success: false, message: "Valid recipient email is required" }, { status: 400 })
    }

    if (!html && !templateId) {
      return NextResponse.json(
        { success: false, message: "Either HTML content or template ID is required" },
        { status: 400 },
      )
    }

    const result = await sendTransactionalEmail({
      to,
      subject,
      html,
      templateId,
      variables,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
      })
    } else {
      console.error("MailerLite error:", result.error)
      return NextResponse.json(
        { success: false, message: "Failed to send email. Please try again later." },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
