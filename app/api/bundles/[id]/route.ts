import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const bundleId = params.id

    // Delete the bundle (cascade will delete bundle-document relationships)
    await sql`DELETE FROM "Bundle" WHERE "id" = ${bundleId}`

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting bundle:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
