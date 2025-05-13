import { NextResponse } from "next/server"
import { documentQueries } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { neon } from "@neondatabase/serverless"

// Helper function to extract Google Drive file ID
function extractGoogleDriveFileId(url: string): string | null {
  // Match patterns like https://drive.google.com/file/d/FILE_ID/view
  const match = url.match(/\/file\/d\/([^/]+)\//)
  return match ? match[1] : null
}

// Helper function to get direct download URL from Google Drive
function getGoogleDriveDirectUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`
}

export async function POST(request: Request) {
  try {
const sql = neon(process.env.DATABASE_URL!)
const data = await request.json()
    const { name, description, price, category, format, url, bundleIds = [] } = data

    // Validate required fields
    if (!name || !description || isNaN(price) || !category || !format || !url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Process URL based on source
    let processedUrl = url

    // Handle Google Drive URLs
    if (url.includes("drive.google.com")) {
      const fileId = extractGoogleDriveFileId(url)
      if (!fileId) {
        return NextResponse.json({ error: "Invalid Google Drive URL format" }, { status: 400 })
      }
      processedUrl = getGoogleDriveDirectUrl(fileId)
    }

    // Create document record in database
    const documentId = uuidv4()
    const document = await documentQueries.create({
      id: documentId,
      name,
      description,
      price: Number.parseFloat(price.toString()),
      blobUrl: processedUrl,
      formats: [format],
      category,
    })

    // If bundleIds are provided, associate the document with those bundles
    if (bundleIds && bundleIds.length > 0) {
      for (const bundleId of bundleIds) {
        try {
          await sql`
            INSERT INTO "BundleDocument" ("bundleId", "documentId") 
            VALUES (${bundleId}, ${documentId})
          `
        } catch (err) {
          console.error(`Error associating document with bundle ${bundleId}:`, err)
          // Continue with other bundles even if one fails
        }
      }
    }

    return NextResponse.json(document[0])
  } catch (error: any) {
    console.error("Error creating document from URL:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
