import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import fs from "fs"
import path from "path"

export async function GET() {
  return handleInitialization()
}

export async function POST() {
  return handleInitialization()
}

async function handleInitialization() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "app/api/onboarding/create-tables.sql")
    const sqlQuery = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL query
    await sql(sqlQuery)

    // Verify tables were created
    const tablesCheck = await sql`
      SELECT 
        (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'onboarding_emails')) as emails_exists,
        (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'onboarding_sequences')) as sequences_exists
    `

    const emailsTableExists = tablesCheck[0]?.emails_exists || false
    const sequencesTableExists = tablesCheck[0]?.sequences_exists || false

    if (!emailsTableExists || !sequencesTableExists) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create all required tables",
          details: { emailsTableExists, sequencesTableExists },
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Onboarding tables created successfully",
      details: { emailsTableExists, sequencesTableExists },
    })
  } catch (error) {
    console.error("Error creating onboarding tables:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create onboarding tables",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
