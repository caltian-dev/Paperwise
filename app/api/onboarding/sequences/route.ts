import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // First check if the table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'onboarding_sequences'
      );
    `

    const tableExists = tableCheck[0]?.exists || false

    if (!tableExists) {
      return NextResponse.json({
        success: true,
        sequences: [],
        initialized: false,
        message: "Onboarding tables not initialized yet",
      })
    }

    const sequences = await sql`
      SELECT * FROM onboarding_sequences
      ORDER BY started_at DESC
    `

    return NextResponse.json({ success: true, sequences, initialized: true })
  } catch (error) {
    console.error("Error fetching onboarding sequences:", error)
    return NextResponse.json(
      {
        success: false,
        sequences: [],
        initialized: false,
        error: "Failed to fetch onboarding sequences",
      },
      { status: 500 },
    )
  }
}
