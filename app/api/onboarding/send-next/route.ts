import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { sendTransactionalEmail } from "@/lib/mailerlite"
import { onboardingEmailTemplates } from "@/lib/email-templates"

// Define the sequence of emails
const SEQUENCE = [
  { type: "welcome", delay: 0 }, // Sent immediately on signup
  { type: "featuredTemplates", delay: 2 }, // Sent 2 days after welcome
  { type: "bundleValue", delay: 5 }, // Sent 5 days after welcome
  { type: "tips", delay: 9 }, // Sent 9 days after welcome
  { type: "feedback", delay: 14 }, // Sent 14 days after welcome
]

// Map email types to subjects
const EMAIL_SUBJECTS = {
  welcome: "Welcome to Paperwise!",
  featuredTemplates: "Discover Our Most Popular Templates",
  bundleValue: "Save with Our Document Bundles",
  tips: "Legal Tips for Your Business",
  feedback: "How's Your Experience with Paperwise?",
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get user's current sequence status
    const sequences = await sql`
      SELECT * FROM onboarding_sequences WHERE user_id = ${userId}
    `

    if (sequences.length === 0) {
      return NextResponse.json({ success: false, error: "User is not in an onboarding sequence" }, { status: 404 })
    }

    const sequence = sequences[0]

    // If sequence is completed, return
    if (sequence.completed) {
      return NextResponse.json({
        success: true,
        message: "Onboarding sequence already completed",
        completed: true,
      })
    }

    // Get current step
    const currentStep = sequence.current_step

    // If we've reached the end of the sequence
    if (currentStep >= SEQUENCE.length) {
      await sql`
        UPDATE onboarding_sequences 
        SET completed = true
        WHERE user_id = ${userId}
      `

      return NextResponse.json({
        success: true,
        message: "Onboarding sequence completed",
        completed: true,
      })
    }

    // Get the next email type
    const nextEmailType = SEQUENCE[currentStep].type

    // Check if this email has already been sent
    const sentEmails = await sql`
      SELECT * FROM onboarding_emails 
      WHERE user_id = ${userId} AND email_type = ${nextEmailType}
    `

    if (sentEmails.length > 0) {
      // Skip to next step
      await sql`
        UPDATE onboarding_sequences 
        SET current_step = ${currentStep + 1}
        WHERE user_id = ${userId}
      `

      return NextResponse.json({
        success: true,
        message: `Email ${nextEmailType} already sent, moved to next step`,
        skipped: true,
        nextStep: currentStep + 1,
      })
    }

    // Send the email
    const templateFunction = onboardingEmailTemplates[nextEmailType as keyof typeof onboardingEmailTemplates]
    const emailHtml = templateFunction(sequence.name || "User")

    const emailResult = await sendTransactionalEmail({
      to: sequence.email,
      subject: EMAIL_SUBJECTS[nextEmailType as keyof typeof EMAIL_SUBJECTS],
      html: emailHtml,
    })

    // Record the email sent
    await sql`
      INSERT INTO onboarding_emails (user_id, email, email_type)
      VALUES (${userId}, ${sequence.email}, ${nextEmailType})
    `

    // Update sequence status
    await sql`
      UPDATE onboarding_sequences 
      SET current_step = ${currentStep + 1}, last_email_sent_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `

    return NextResponse.json({
      success: true,
      message: `Sent ${nextEmailType} email successfully`,
      emailSent: emailResult.success,
      currentStep: currentStep + 1,
    })
  } catch (error) {
    console.error("Error sending next onboarding email:", error)
    return NextResponse.json({ success: false, error: "Failed to send next onboarding email" }, { status: 500 })
  }
}
