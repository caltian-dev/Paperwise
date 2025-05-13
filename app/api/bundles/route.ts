import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!)
  try {
    // Get all bundles with their documents
    const bundles = await sql`
      SELECT b.*, 
             json_agg(json_build_object(
               'id', d."id", 
               'name', d."name", 
               'price', d."price"
             )) as documents
      FROM "Bundle" b
      LEFT JOIN "BundleDocument" bd ON b."id" = bd."bundleId"
      LEFT JOIN "Document" d ON bd."documentId" = d."id"
      GROUP BY b."id"
      ORDER BY b."createdAt" DESC
    `

    return NextResponse.json({ bundles })
  } catch (error: any) {
    console.error("Error fetching bundles:", error)
    return NextResponse.json({ error: error.message, bundles: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const sql = neon(process.env.DATABASE_URL!)
  try {
    const { name, description, price, category, documentIds, popular } = await request.json()

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !documentIds ||
      !Array.isArray(documentIds) ||
      documentIds.length === 0
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a new bundle
    const bundleId = uuidv4()

    // Insert the bundle
    await sql`
      INSERT INTO "Bundle" ("id", "name", "description", "price", "category", "popular") 
      VALUES (${bundleId}, ${name}, ${description}, ${price}, ${category}, ${popular || false})
    `

    // Insert bundle-document relationships
    for (const documentId of documentIds) {
      await sql`
        INSERT INTO "BundleDocument" ("bundleId", "documentId") 
        VALUES (${bundleId}, ${documentId})
      `
    }

    // Get the created bundle with its documents
    const bundle = await sql`
      SELECT b.*, 
              json_agg(json_build_object(
                'id', d."id", 
                'name', d."name", 
                'price', d."price"
              )) as documents
       FROM "Bundle" b
       LEFT JOIN "BundleDocument" bd ON b."id" = bd."bundleId"
       LEFT JOIN "Document" d ON bd."documentId" = d."id"
       WHERE b."id" = ${bundleId}
       GROUP BY b."id"
    `

    return NextResponse.json(bundle[0])
  } catch (error: any) {
    console.error("Error creating bundle:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
