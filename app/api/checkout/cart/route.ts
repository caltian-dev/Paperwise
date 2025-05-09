import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { documentQueries } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export const runtime = "nodejs" // Add this line

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { items } = await request.json()

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Get document IDs
    const documentIds = items.map((item) => item.id)

    // Get document details
    const documents = await documentQueries.getByIds(documentIds)

    if (!documents || documents.length === 0) {
      return NextResponse.json({ error: "No valid documents found" }, { status: 404 })
    }

    // Create a map of document details
    const documentMap = new Map(documents.map((doc) => [doc.id, doc]))

    // Create line items for Stripe
    const lineItems = items
      .filter((item) => documentMap.has(item.id))
      .map((item) => {
        const document = documentMap.get(item.id)
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: document.name,
              description: document.description || `${document.category} document`,
            },
            unit_amount: Math.round(document.price * 100), // Convert to cents
          },
          quantity: item.quantity || 1,
        }
      })

    // Create a Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/purchases?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart?canceled=true`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
        cartItems: JSON.stringify(
          items.map((item) => ({
            documentId: item.id,
            quantity: item.quantity || 1,
          })),
        ),
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: error.message || "An error occurred during checkout" }, { status: 500 })
  }
}
