import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    // Check if the legal_documents table exists
    const tableCheck = await executeQuery(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'legal_documents'
      );
    `)

    const tableExists = tableCheck[0].exists

    if (!tableExists) {
      return NextResponse.json({})
    }

    // Fetch all legal documents
    const documents = await executeQuery(`SELECT * FROM "legal_documents";`)

    // Format the response
    const response: Record<string, any> = {}

    documents.forEach((doc: any) => {
      response[doc.id] = {
        title: doc.title,
        content: doc.content,
        pdfUrl: doc.pdfUrl,
        lastUpdated: doc.lastUpdated,
      }
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching legal documents:", error)
    return NextResponse.json({ error: "Failed to fetch legal documents" }, { status: 500 })
  }
}
