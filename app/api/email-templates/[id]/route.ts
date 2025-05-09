import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const sql = neon(process.env.DATABASE_URL!)

    const templates = await sql`
      SELECT * FROM "email_templates"
      WHERE "id" = ${id}
    `

    if (templates.length === 0) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, template: templates[0] })
  } catch (error) {
    console.error(`Error fetching email template ${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Failed to fetch email template" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { name, subject, html_content, description } = await request.json()
    const sql = neon(process.env.DATABASE_URL!)

    // Validate required fields
    if (!name || !subject || !html_content) {
      return NextResponse.json(
        { success: false, error: "Name, subject, and HTML content are required" },
        { status: 400 },
      )
    }

    // Update the template
    await sql`
      UPDATE "email_templates"
      SET 
        "name" = ${name},
        "subject" = ${subject},
        "html_content" = ${html_content},
        "description" = ${description || null},
        "last_updated" = CURRENT_TIMESTAMP
      WHERE "id" = ${id}
    `

    return NextResponse.json({
      success: true,
      message: "Email template updated successfully",
    })
  } catch (error) {
    console.error(`Error updating email template ${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Failed to update email template" }, { status: 500 })
  }
}
