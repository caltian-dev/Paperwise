import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get featured bundles with their documents
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
      ORDER BY b."popular" DESC, b."price" ASC
      LIMIT 3
    `

    return NextResponse.json({ bundles })
  } catch (error: any) {
    console.error("Error fetching featured bundles:", error)

    // Return fallback bundles if database query fails
    const fallbackBundles = [
      {
        id: "bundle1",
        name: "LLC Bundle",
        description:
          "Essential documents for Limited Liability Companies including Operating Agreement and Board Resolution.",
        price: 69,
        popular: true,
        documents: [{ name: "LLC Operating Agreement" }, { name: "LLC Board Resolution" }],
        category: "business",
      },
      {
        id: "bundle2",
        name: "Corporation Bundle",
        description: "Complete set of documents for incorporating and managing a corporation.",
        price: 149,
        popular: false,
        documents: [
          { name: "First Board Meeting" },
          { name: "Corporate By-Laws" },
          { name: "Meeting Minutes" },
          { name: "Shareholder Agreement" },
        ],
        category: "business",
      },
      {
        id: "bundle3",
        name: "Small Business Bundle (LLC)",
        description: "Comprehensive legal package for LLCs with all essential documents.",
        price: 249,
        popular: false,
        documents: [
          { name: "LLC Operating Agreement" },
          { name: "LLC Board Resolution" },
          { name: "Independent Contractor Agreement (ABC)" },
          { name: "Licensing Agreement" },
          { name: "Non-Disclosure Agreement" },
          { name: "Non-Compete" },
          { name: "Partnership Agreement" },
          { name: "Sales Agreement" },
          { name: "Master Services Agreement" },
        ],
        category: "business",
      },
    ]

    return NextResponse.json({ bundles: fallbackBundles })
  }
}
