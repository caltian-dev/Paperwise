import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    // Create Bundle table
    await sql`
      CREATE TABLE IF NOT EXISTS "Bundle" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "price" FLOAT NOT NULL,
        "category" TEXT NOT NULL,
        "popular" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create BundleDocument table
    await sql`
      CREATE TABLE IF NOT EXISTS "BundleDocument" (
        "bundleId" TEXT NOT NULL,
        "documentId" TEXT NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("bundleId", "documentId"),
        FOREIGN KEY ("bundleId") REFERENCES "Bundle" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE
      )
    `

    return NextResponse.json({ success: true, message: "Bundle tables created successfully" })
  } catch (error: any) {
    console.error("Error creating bundle tables:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
