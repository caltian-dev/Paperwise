import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@neondatabase/serverless"
import { getSignedUrl } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      // For public documents, we might still allow preview with restrictions
      // For now, we'll require authentication
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const documentId = params.id

    // Get document details from database
    const document = await sql`
      SELECT id, name, url, format FROM documents WHERE id = ${documentId}
    `

    if (!document.rows.length) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    const { url, format } = document.rows[0]

    // Generate a signed URL with short expiration for preview
    const previewUrl = await getSignedUrl(url, {
      expiration: 60 * 5, // 5 minutes
    })

    return NextResponse.json({
      previewUrl,
      format,
    })
  } catch (error) {
    console.error("Error generating preview URL:", error)
    return NextResponse.json({ error: "Failed to generate preview URL" }, { status: 500 })
  }
}
