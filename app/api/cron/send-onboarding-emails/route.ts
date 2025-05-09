import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { sendTransactionalEmail } from "@/lib/mailerlite"
import { onboardingEmailTemplates } from "@/lib/email-templates"

// Define the sequence of emails with delays in days
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
  feature: "Welcome to Paperwise!",
  featuredTemplates: "Discover Our Most Popular Templates",
  bundleValue: "Save with Our Document Bundles",
  tips: "Legal Tips for Your Business",
  feedback: "How's Your Experience with Paperwise?",
}

export async function GET(request: Request) {
  try {
    // Verify this is a cron job request (optional security check)
    const authHeader = request.headers.get("Authorization")
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get all active sequences that aren't completed
    const activeSequences = await sql`
      SELECT * FROM onboarding_sequences 
      WHERE completed = false
    `

    const results = []

    for (const sequence of activeSequences) {
      // Get current step
      const currentStep = sequence.current_step

      // If we've reached the end of the sequence
      if (currentStep >= SEQUENCE.length) {
        await sql`
          UPDATE onboarding_sequences 
          SET completed = true
          WHERE user_id = ${sequence.user_id}
        `

        results.push({
          userId: sequence.user_id,
          status: "completed",
          message: "Onboarding sequence completed",
        })

        continue
      }

      // Get the current email type and required delay
      const currentEmailType = SEQUENCE[currentStep].type
      const requiredDelay = SEQUENCE[currentStep].delay

      // Calculate if enough time has passed since the last email
      const lastEmailDate = sequence.last_email_sent_at || sequence.started_at
      const daysSinceLastEmail = Math.floor((Date.now() - new Date(lastEmailDate).getTime()) / (1000 * 60 * 60 * 24))

      // Check if this email has already been sent
      const sentEmails = await sql`
        SELECT * FROM onboarding_emails 
        WHERE user_id = ${sequence.user_id} AND email_type = ${currentEmailType}
      `

      if (sentEmails.length > 0) {
        // Skip to next step
        await sql`
          UPDATE onboarding_sequences 
          SET current_step = ${currentStep + 1}
          WHERE user_id = ${sequence.user_id}
        `

        results.push({
          userId: sequence.user_id,
          status: "skipped",
          message: `Email ${currentEmailType} already sent, moved to next step`,
        })

        continue
      }

      // Check if enough time has passed based on the delay
      if (daysSinceLastEmail < requiredDelay) {
        results.push({
          userId: sequence.user_id,
          status: "waiting",
          message: `Waiting for ${requiredDelay - daysSinceLastEmail} more days before sending ${currentEmailType}`,
        })

        continue
      }

      // Send the email
      const templateFunction = onboardingEmailTemplates[currentEmailType as keyof typeof onboardingEmailTemplates]
      const emailHtml = templateFunction(sequence.name || "User")

      const emailResult = await sendTransactionalEmail({
        to: sequence.email,
        subject: EMAIL_SUBJECTS[currentEmailType as keyof typeof EMAIL_SUBJECTS],
        html: emailHtml,
      })

      // Record the email sent
      await sql`
        INSERT INTO onboarding_emails (user_id, email, email_type)
        VALUES (${sequence.user_id}, ${sequence.email}, ${currentEmailType})
      `

      // Update sequence status
      await sql`
        UPDATE onboarding_sequences 
        SET current_step = ${currentStep + 1}, last_email_sent_at = CURRENT_TIMESTAMP
        WHERE user_id = ${sequence.user_id}
      `

      results.push({
        userId: sequence.user_id,
        status: "sent",
        message: `Sent ${currentEmailType} email successfully`,
        emailSent: emailResult.success,
      })
    }

    return NextResponse.json({
      success: true,
      processed: activeSequences.length,
      results,
    })
  } catch (error) {
    console.error("Error processing onboarding emails:", error)
    return NextResponse.json({ success: false, error: "Failed to process onboarding emails" }, { status: 500 })
  }
}
