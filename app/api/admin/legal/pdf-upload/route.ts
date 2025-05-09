import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { executeQuery } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentType = formData.get("documentType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!documentType) {
      return NextResponse.json({ error: "No document type provided" }, { status: 400 })
    }

    // Validate document type
    const validTypes = ["privacy-policy", "terms-of-service", "disclaimer", "cookie-policy"]
    if (!validTypes.includes(documentType)) {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 })
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`legal-documents/${documentType}-${Date.now()}.pdf`, file, {
      access: "public",
    })

    // Check if the document already exists in the database
    const existingDoc = await executeQuery(`SELECT * FROM "legal_documents" WHERE "id" = $1`, [documentType])

    const title = documentType
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    const lastUpdated = new Date().toISOString().split("T")[0]

    if (existingDoc.length > 0) {
      // Update existing document
      await executeQuery(
        `UPDATE "legal_documents" SET "title" = $1, "pdfUrl" = $2, "lastUpdated" = $3 WHERE "id" = $4`,
        [title, blob.url, lastUpdated, documentType],
      )
    } else {
      // Insert new document
      await executeQuery(
        `INSERT INTO "legal_documents" ("id", "title", "pdfUrl", "lastUpdated") VALUES ($1, $2, $3, $4)`,
        [documentType, title, blob.url, lastUpdated],
      )
    }

    return NextResponse.json({
      success: true,
      message: "PDF uploaded successfully",
      url: blob.url,
    })
  } catch (error) {
    console.error("Error uploading PDF:", error)
    return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 })
  }
}
