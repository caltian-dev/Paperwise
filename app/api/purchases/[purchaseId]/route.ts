import { NextResponse } from "next/server"
import { purchaseQueries } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { purchaseId: string } }) {
  try {
    const purchaseId = params.purchaseId

    // Verify the user is authenticated
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the purchase with document details
    const purchase = await purchaseQueries.getById(purchaseId)

    if (!purchase || purchase.userId !== session.user.id) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    return NextResponse.json({
      purchase: {
        id: purchase.id,
        status: purchase.status,
        amount: purchase.amount,
        downloadCount: purchase.downloadCount,
        expiresAt: purchase.expiresAt,
        createdAt: purchase.createdAt,
      },
      document: {
        id: purchase.documentId,
        name: purchase.name,
        description: purchase.description,
        formats: purchase.formats,
        category: purchase.category,
      },
    })
  } catch (error: any) {
    console.error("Error fetching purchase:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
