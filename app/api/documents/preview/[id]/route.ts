import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSignedUrl } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const documentId = params.id

    const sql = neon(process.env.DATABASE_URL!)
    const document = await sql`
      SELECT id, name, url, format FROM documents WHERE id = ${documentId}
    `

    if (!document.length) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    const { url, format } = document[0]

    const previewUrl = await getSignedUrl(url, {
      expiration: 60 * 5,
    })

    return NextResponse.json({ previewUrl, format })
  } catch (error) {
    console.error("Error generating preview URL:", error)
    return NextResponse.json({ error: "Failed to generate preview URL" }, { status: 500 })
  }
}
