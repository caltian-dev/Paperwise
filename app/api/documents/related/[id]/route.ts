import { type NextRequest, NextResponse } from "next/server"
import { documentQueries } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const documentId = params.id

    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    // Get related documents
    const relatedDocuments = await documentQueries.getRelated(documentId)

    return NextResponse.json({ documents: relatedDocuments })
  } catch (error: any) {
    console.error("Error fetching related documents:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch related documents" }, { status: 500 })
  }
}
