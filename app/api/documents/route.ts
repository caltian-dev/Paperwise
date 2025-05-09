import { NextResponse } from "next/server"
import { documentQueries } from "@/lib/db"

export async function GET() {
  try {
    const documents = await documentQueries.getAll()

    return NextResponse.json({ documents })
  } catch (error: any) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: error.message, documents: [] }, { status: 500 })
  }
}
