import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const templates = await sql`
      SELECT * FROM "email_templates"
      ORDER BY "name" ASC
    `

    return NextResponse.json({ success: true, templates })
  } catch (error) {
    console.error("Error fetching email templates:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch email templates" }, { status: 500 })
  }
}
