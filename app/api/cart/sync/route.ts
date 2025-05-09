import { type NextRequest, NextResponse } from "next/server"
import { cartQueries, documentQueries } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { items } = await request.json()

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Items must be an array" }, { status: 400 })
    }

    // Get or create cart for the user
    const cart = await cartQueries.getOrCreate(session.user.id)

    // Get existing cart items
    const existingItems = await cartQueries.getItems(cart.id)
    const existingItemMap = new Map(existingItems.map((item) => [item.documentId, item]))

    // Process each item from the local cart
    for (const item of items) {
      if (!item.id || !item.quantity) continue

      // Check if document exists
      const document = await documentQueries.getById(item.id)
      if (!document) continue

      if (existingItemMap.has(item.id)) {
        // Update quantity if item already exists
        const existingItem = existingItemMap.get(item.id)
        const newQuantity = Math.max(existingItem.quantity, item.quantity)
        await cartQueries.updateItemQuantity(cart.id, item.id, newQuantity)
      } else {
        // Add new item
        await cartQueries.addItem(cart.id, item.id, item.quantity)
      }
    }

    // Get updated cart items
    const updatedItems = await cartQueries.getItems(cart.id)

    return NextResponse.json({
      success: true,
      cart,
      items: updatedItems,
    })
  } catch (error: any) {
    console.error("Error syncing cart:", error)
    return NextResponse.json({ error: error.message || "Failed to sync cart" }, { status: 500 })
  }
}
