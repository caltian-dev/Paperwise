import { type NextRequest, NextResponse } from "next/server"
import { documentQueries } from "@/lib/db"
import { del } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const { documentIds } = await request.json()

    if (!Array.isArray(documentIds) || documentIds.length === 0) {
      return NextResponse.json({ error: "Invalid request. Please provide an array of document IDs." }, { status: 400 })
    }

    console.log(`Starting bulk delete for ${documentIds.length} documents`)

    // Get the documents to delete (to get their blob URLs)
    const documentsToDelete = []
    for (const id of documentIds) {
      try {
        const document = await documentQueries.getById(id)
        if (document) {
          documentsToDelete.push(document)
        }
      } catch (error) {
        console.error(`Error fetching document ${id}:`, error)
        // Continue with other documents
      }
    }

    console.log(`Found ${documentsToDelete.length} documents to delete`)

    // Delete the documents from the database first
    let deletedCount = 0
    for (const id of documentIds) {
      try {
        await documentQueries.delete(id)
        deletedCount++
      } catch (error) {
        console.error(`Error deleting document ${id} from database:`, error)
        // Continue with other documents
      }
    }

    console.log(`Deleted ${deletedCount} documents from database`)

    // Delete the blobs one by one to avoid rate limits
    let blobDeleteCount = 0
    for (const doc of documentsToDelete) {
      if (doc.blobUrl) {
        try {
          console.log(`Attempting to delete blob: ${doc.blobUrl}`)
          await del(doc.blobUrl)
          blobDeleteCount++
        } catch (error) {
          console.error(`Error deleting blob for document ${doc.id}:`, error)
          // Continue with other blobs
        }
      }
    }

    console.log(`Deleted ${blobDeleteCount} blobs`)

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} documents.`,
      details: {
        documentsDeleted: deletedCount,
        blobsDeleted: blobDeleteCount,
      },
    })
  } catch (error: any) {
    console.error("Error in bulk delete:", error)
    return NextResponse.json(
      {
        error: error.message || "An unknown error occurred during bulk deletion",
      },
      { status: 500 },
    )
  }
}
