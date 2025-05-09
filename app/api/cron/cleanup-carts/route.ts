import { type NextRequest, NextResponse } from "next/server"
import { cartQueries } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete expired carts
    const result = await cartQueries.deleteExpired()

    return NextResponse.json({
      success: true,
      message: "Expired carts cleaned up successfully",
    })
  } catch (error: any) {
    console.error("Error cleaning up carts:", error)
    return NextResponse.json({ error: error.message || "Failed to clean up carts" }, { status: 500 })
  }
}
