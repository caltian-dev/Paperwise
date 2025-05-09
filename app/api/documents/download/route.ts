import { NextResponse } from "next/server"
import { getDocumentUrl } from "@/lib/blob-storage"
import { documentQueries, purchaseQueries } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Get the document ID and purchase ID from the request
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("documentId")
    const purchaseId = searchParams.get("purchaseId")

    if (!documentId || !purchaseId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Verify the user is authenticated
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the purchase belongs to the user
    const purchase = await purchaseQueries.getById(purchaseId)

    if (
      !purchase ||
      purchase.userId !== session.user.id ||
      purchase.documentId !== documentId ||
      purchase.status !== "completed"
    ) {
      return NextResponse.json({ error: "Purchase not found or not completed" }, { status: 404 })
    }

    // Check if the download link has expired
    if (new Date(purchase.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Download link has expired" }, { status: 403 })
    }

    // Get the document from your database
    const document = await documentQueries.getById(documentId)

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Update download count
    await purchaseQueries.incrementDownloadCount(purchaseId)

    // Generate a temporary URL for the document
    try {
      const signedUrl = await getDocumentUrl(document.blobUrl, 3600) // 1 hour expiry
      return NextResponse.json({ url: signedUrl })
    } catch (error) {
      console.error("Error generating document URL:", error)
      return NextResponse.json({ error: "Document file not found" }, { status: 404 })
    }
  } catch (error: any) {
    console.error("Error generating download link:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
