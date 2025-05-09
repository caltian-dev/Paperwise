import { NextResponse } from "next/server"
import { purchaseQueries } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Verify the user is authenticated
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all purchases for the user
    const purchases = await purchaseQueries.getByUserId(session.user.id)

    return NextResponse.json({
      purchases: purchases.map((purchase: any) => ({
        id: purchase.id,
        status: purchase.status,
        amount: purchase.amount,
        downloadCount: purchase.downloadCount,
        expiresAt: purchase.expiresAt,
        createdAt: purchase.createdAt,
        document: {
          id: purchase.documentId,
          name: purchase.name,
          description: purchase.description,
          formats: purchase.formats,
          category: purchase.category,
        },
      })),
    })
  } catch (error: any) {
    console.error("Error fetching purchases:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
