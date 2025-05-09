import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { addSubscriberToMailerLite, sendTransactionalEmail } from "@/lib/mailerlite"
import { onboardingEmailTemplates } from "@/lib/email-templates"

export async function POST(request: Request) {
  try {
    const { userId, email, name } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ success: false, error: "User ID and email are required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if user is already in an onboarding sequence
    const existingSequence = await sql`
      SELECT * FROM onboarding_sequences WHERE user_id = ${userId}
    `

    if (existingSequence.length > 0) {
      return NextResponse.json({ success: false, error: "User is already in an onboarding sequence" }, { status: 400 })
    }

    // Add user to onboarding sequence
    await sql`
      INSERT INTO onboarding_sequences (user_id, email, name)
      VALUES (${userId}, ${email}, ${name || "User"})
    `

    // Send welcome email (first in sequence)
    const welcomeHtml = onboardingEmailTemplates.welcome(name || "User")
    const emailResult = await sendTransactionalEmail({
      to: email,
      subject: "Welcome to Paperwise!",
      html: welcomeHtml,
    })

    // Record the email sent
    await sql`
      INSERT INTO onboarding_emails (user_id, email, email_type)
      VALUES (${userId}, ${email}, 'welcome')
    `

    // Update sequence status
    await sql`
      UPDATE onboarding_sequences 
      SET current_step = 1, last_email_sent_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `

    // Also add user to MailerLite subscriber list
    await addSubscriberToMailerLite(email)

    return NextResponse.json({
      success: true,
      message: "Onboarding sequence started successfully",
      emailSent: emailResult.success,
    })
  } catch (error) {
    console.error("Error starting onboarding sequence:", error)
    return NextResponse.json({ success: false, error: "Failed to start onboarding sequence" }, { status: 500 })
  }
}
