import { type NextRequest, NextResponse } from "next/server"
import { cartQueries, documentQueries } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get or create cart for the user
    const cart = await cartQueries.getOrCreate(session.user.id)

    // Get cart items
    const cartItems = await cartQueries.getItems(cart.id)

    return NextResponse.json({
      cart,
      items: cartItems,
    })
  } catch (error: any) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { documentId, quantity = 1 } = await request.json()

    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    // Verify document exists
    const document = await documentQueries.getById(documentId)
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Get or create cart for the user
    const cart = await cartQueries.getOrCreate(session.user.id)

    // Add item to cart
    await cartQueries.addItem(cart.id, documentId, quantity)

    // Get updated cart items
    const cartItems = await cartQueries.getItems(cart.id)

    return NextResponse.json({
      success: true,
      cart,
      items: cartItems,
    })
  } catch (error: any) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: error.message || "Failed to add item to cart" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { documentId, quantity } = await request.json()

    if (!documentId || quantity === undefined) {
      return NextResponse.json({ error: "Document ID and quantity are required" }, { status: 400 })
    }

    // Get cart for the user
    const cart = await cartQueries.getByUserId(session.user.id)

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Update item quantity
    await cartQueries.updateItemQuantity(cart.id, documentId, quantity)

    // Get updated cart items
    const cartItems = await cartQueries.getItems(cart.id)

    return NextResponse.json({
      success: true,
      cart,
      items: cartItems,
    })
  } catch (error: any) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ error: error.message || "Failed to update cart" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("documentId")
    const clearAll = searchParams.get("clearAll") === "true"

    // Get cart for the user
    const cart = await cartQueries.getByUserId(session.user.id)

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    if (clearAll) {
      // Clear entire cart
      await cartQueries.clearCart(cart.id)
    } else if (documentId) {
      // Remove specific item
      await cartQueries.removeItem(cart.id, documentId)
    } else {
      return NextResponse.json({ error: "Either documentId or clearAll parameter is required" }, { status: 400 })
    }

    // Get updated cart items
    const cartItems = await cartQueries.getItems(cart.id)

    return NextResponse.json({
      success: true,
      cart,
      items: cartItems,
    })
  } catch (error: any) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: error.message || "Failed to remove from cart" }, { status: 500 })
  }
}
