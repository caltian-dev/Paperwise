import { NextResponse } from "next/server"
import { documentQueries } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, description, price, category, format, bundleIds = [] } = data

    // Validate required fields
    if (!name || !description || isNaN(price) || !category || !format) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // For metadata-only uploads, we'll use a placeholder URL
    // You'll need to update this later with the actual document
    const placeholderUrl = `https://placeholder-document.vercel.app/${format}/${uuidv4()}`

    // Create document record in database
    const documentId = uuidv4()
    const document = await documentQueries.create({
      id: documentId,
      name,
      description,
      price: Number.parseFloat(price.toString()),
      blobUrl: placeholderUrl,
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
    console.error("Error creating document metadata:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
