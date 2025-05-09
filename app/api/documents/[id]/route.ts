import { NextResponse } from "next/server"
import { documentQueries } from "@/lib/db"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const documentId = params.id

    // Delete the document
    await documentQueries.delete(documentId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
