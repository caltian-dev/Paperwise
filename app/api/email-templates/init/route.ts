import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import fs from "fs"
import path from "path"
import { onboardingEmailTemplates, getPurchaseConfirmationTemplate } from "@/lib/email-templates"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "app/api/email-templates/create-tables.sql")
    const sqlQuery = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL query
    await sql`${sqlQuery}`

    // Update the default templates with our actual template content
    const dummyData = {
      customerName: "John Doe",
      documentName: "LLC Operating Agreement",
      documentType: "document",
      purchaseId: "PURCHASE123",
      downloadLink: "https://example.com/download",
      expiryDate: "May 1, 2023",
    }

    // Update welcome template
    await sql`
      UPDATE "email_templates" 
      SET "html_content" = ${onboardingEmailTemplates.welcome("John")}
      WHERE "id" = 'welcome'
    `

    // Update featured templates template
    await sql`
      UPDATE "email_templates" 
      SET "html_content" = ${onboardingEmailTemplates.featuredTemplates("John")}
      WHERE "id" = 'featured_templates'
    `

    // Update bundle value template
    await sql`
      UPDATE "email_templates" 
      SET "html_content" = ${onboardingEmailTemplates.bundleValue("John")}
      WHERE "id" = 'bundle_value'
    `

    // Update legal tips template
    await sql`
      UPDATE "email_templates" 
      SET "html_content" = ${onboardingEmailTemplates.tips("John")}
      WHERE "id" = 'legal_tips'
    `

    // Update feedback template
    await sql`
      UPDATE "email_templates" 
      SET "html_content" = ${onboardingEmailTemplates.feedback("John")}
      WHERE "id" = 'feedback'
    `

    // Update purchase confirmation template
    await sql`
      UPDATE "email_templates" 
      SET "html_content" = ${getPurchaseConfirmationTemplate(dummyData)}
      WHERE "id" = 'purchase_confirmation'
    `

    return NextResponse.json({ success: true, message: "Email templates initialized successfully" })
  } catch (error) {
    console.error("Error initializing email templates:", error)
    return NextResponse.json({ success: false, error: "Failed to initialize email templates" }, { status: 500 })
  }
}
