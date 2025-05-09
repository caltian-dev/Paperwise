import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // First check if the table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'onboarding_emails'
      );
    `

    const tableExists = tableCheck[0]?.exists || false

    if (!tableExists) {
      return NextResponse.json({
        success: true,
        emails: [],
        initialized: false,
        message: "Onboarding tables not initialized yet",
      })
    }

    const emails = await sql`
      SELECT * FROM onboarding_emails
      ORDER BY sent_at DESC
      LIMIT 100
    `

    return NextResponse.json({ success: true, emails, initialized: true })
  } catch (error) {
    console.error("Error fetching onboarding emails:", error)
    return NextResponse.json(
      {
        success: false,
        emails: [],
        initialized: false,
        error: "Failed to fetch onboarding emails",
      },
      { status: 500 },
    )
  }
}
