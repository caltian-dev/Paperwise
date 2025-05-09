import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function POST(request: Request, { params }: { params: { type: string } }) {
  try {
    const { type } = params

    // Validate document type
    const validTypes = ["privacy-policy", "terms-of-service", "disclaimer", "cookie-policy"]
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 })
    }

    const { title, content, lastUpdated } = await request.json()

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Check if the document already exists
    const existingDoc = await executeQuery(`SELECT * FROM "legal_documents" WHERE "id" = $1`, [type])

    if (existingDoc.length > 0) {
      // Update existing document
      await executeQuery(
        `UPDATE "legal_documents" SET "title" = $1, "content" = $2, "lastUpdated" = $3 WHERE "id" = $4`,
        [title, content, lastUpdated, type],
      )
    } else {
      // Insert new document
      await executeQuery(
        `INSERT INTO "legal_documents" ("id", "title", "content", "lastUpdated") VALUES ($1, $2, $3, $4)`,
        [type, title, content, lastUpdated],
      )
    }

    return NextResponse.json({ success: true, message: "Document saved successfully" })
  } catch (error) {
    console.error(`Error saving ${params.type}:`, error)
    return NextResponse.json({ error: "Failed to save document" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { type: string } }) {
  try {
    const { type } = params

    // Validate document type
    const validTypes = ["privacy-policy", "terms-of-service", "disclaimer", "cookie-policy"]
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 })
    }

    // Fetch the document
    const document = await executeQuery(`SELECT * FROM "legal_documents" WHERE "id" = $1`, [type])

    if (document.length === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json(document[0])
  } catch (error) {
    console.error(`Error fetching ${params.type}:`, error)
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 })
  }
}
