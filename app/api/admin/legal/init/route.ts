import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function POST() {
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
      // Create the legal_documents table
      await executeQuery(`
        CREATE TABLE "legal_documents" (
          "id" VARCHAR(50) PRIMARY KEY,
          "title" VARCHAR(100) NOT NULL,
          "content" TEXT,
          "pdfUrl" TEXT,
          "lastUpdated" DATE NOT NULL
        );
      `)
    }

    return NextResponse.json({ success: true, message: "Legal documents table initialized" })
  } catch (error) {
    console.error("Error initializing legal documents table:", error)
    return NextResponse.json({ error: "Failed to initialize legal documents table" }, { status: 500 })
  }
}
