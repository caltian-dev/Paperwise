import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: Request) {
  try {
    const { templateId, email, name } = await request.json()

    // Validate required fields
    if (!templateId || !email) {
      return NextResponse.json({ success: false, error: "Template ID and email are required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get the template
    const templates = await sql`
      SELECT * FROM "email_templates"
      WHERE "id" = ${templateId}
    `

    if (templates.length === 0) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 })
    }

    const template = templates[0]

    // Prepare sample data for different template types
    let sampleData: any = {
      userName: name || "John Doe",
    }

    if (templateId === "purchase_confirmation") {
      sampleData = {
        customerName: name || "John Doe",
        documentName: "LLC Operating Agreement",
        documentType: "document",
        purchaseId: "SAMPLE-123",
        downloadLink: `${process.env.NEXT_PUBLIC_URL}/download/sample`,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      }
    }

    // Replace variables in the template
    let htmlContent = template.html_content

    // Replace all variables in the template
    Object.keys(sampleData).forEach((key) => {
      const regex = new RegExp(`\\{${key}\\}`, "g")
      htmlContent = htmlContent.replace(regex, sampleData[key])
    })

    // Send the email using MailerLite
    const response = await fetch(`https://api.mailerlite.com/api/v2/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MailerLite-ApiKey": process.env.MAILERLITE_API_KEY!,
      },
      body: JSON.stringify({
        subject: template.subject,
        from: "Paperwise <noreply@paperwise.com>",
        to: [{ email }],
        html: htmlContent,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("MailerLite API error:", errorData)
      return NextResponse.json({ success: false, error: "Failed to send email via MailerLite" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json({ success: false, error: "Failed to send test email" }, { status: 500 })
  }
}
