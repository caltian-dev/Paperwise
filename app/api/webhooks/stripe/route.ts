import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { purchaseQueries, documentQueries, userQueries } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { sendTransactionalEmail } from "@/lib/mailerlite"
import { getPurchaseConfirmationTemplate } from "@/lib/email-templates"

export const runtime = "nodejs" // Add this line

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Get user details
      const userId = session.metadata?.userId
      if (!userId) {
        throw new Error("User ID not found in session metadata")
      }

      const userResult = await userQueries.getById(userId)
      if (!userResult) {
        throw new Error(`User not found: ${userId}`)
      }

      // Check if we have multiple documents or a single document
      if (session.metadata?.documentIds) {
        // Handle multiple documents
        const documentIds = session.metadata.documentIds.split(",")

        // Create purchase records for each document
        const purchasePromises = documentIds.map(async (documentId) => {
          const documentResult = await documentQueries.getById(documentId)
          if (!documentResult) {
            console.error(`Document not found: ${documentId}`)
            return null
          }

          // Calculate expiry date (30 days from now)
          const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          const purchaseId = uuidv4()

          // Create the purchase record
          await purchaseQueries.create({
            id: purchaseId,
            documentId: documentId,
            userId: userId,
            stripeSessionId: session.id,
            amount: documentResult.price, // Individual document price
            status: "completed",
            expiresAt: expiryDate,
          })

          return {
            purchaseId,
            document: documentResult,
            expiryDate,
          }
        })

        const purchases = (await Promise.all(purchasePromises)).filter(Boolean)

        if (purchases.length === 0) {
          throw new Error("No valid purchases were created")
        }

        // Generate download links
        const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
        const downloadLinks = purchases.map((purchase) => `${baseUrl}/download/${purchase!.purchaseId}`)

        // Format expiry date for display
        const formattedExpiryDate = purchases[0]!.expiryDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })

        // Create a list of purchased documents for the email
        const documentList = purchases
          .map((purchase) => `<li>${purchase!.document.name} (${purchase!.document.category})</li>`)
          .join("")

        // Send confirmation email for multiple purchases
        await sendTransactionalEmail({
          to: userResult.email,
          subject: `Your Paperwise Purchase: Multiple Documents`,
          html: `
            <h1>Thank you for your purchase, ${userResult.name}!</h1>
            <p>You have successfully purchased the following documents:</p>
            <ul>${documentList}</ul>
            <p>You can download your documents using the links below:</p>
            <ul>
              ${purchases
                .map(
                  (purchase, index) =>
                    `<li><a href="${downloadLinks[index]}">Download ${purchase!.document.name}</a></li>`,
                )
                .join("")}
            </ul>
            <p>Your downloads will be available until ${formattedExpiryDate}.</p>
            <p>Thank you for choosing Paperwise!</p>
          `,
        })

        console.log(`${purchases.length} purchases created and confirmation email sent to ${userResult.email}`)
      } else if (session.metadata?.documentId) {
        // Handle single document (original logic)
        const documentId = session.metadata.documentId
        const documentResult = await documentQueries.getById(documentId)
        if (!documentResult) {
          throw new Error(`Document not found: ${documentId}`)
        }

        // Calculate expiry date (30 days from now)
        const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        const purchaseId = uuidv4()

        // Create the purchase record
        await purchaseQueries.create({
          id: purchaseId,
          documentId: documentId,
          userId: userId,
          stripeSessionId: session.id,
          amount: session.amount_total! / 100, // Convert from cents
          status: "completed",
          expiresAt: expiryDate,
        })

        // Generate download link
        const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
        const downloadLink = `${baseUrl}/download/${purchaseId}`

        // Format expiry date for display
        const formattedExpiryDate = expiryDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })

        // Send confirmation email
        await sendTransactionalEmail({
          to: userResult.email,
          subject: `Your Paperwise Purchase: ${documentResult.name}`,
          html: getPurchaseConfirmationTemplate({
            customerName: userResult.name,
            documentName: documentResult.name,
            documentType: documentResult.category,
            purchaseId: purchaseId,
            downloadLink: downloadLink,
            expiryDate: formattedExpiryDate,
          }),
        })

        console.log(`Purchase ${purchaseId} created and confirmation email sent to ${userResult.email}`)
      } else {
        throw new Error("No document information found in session metadata")
      }
    } catch (error) {
      console.error("Error processing checkout session:", error)
      return NextResponse.json({ error: "Error processing checkout session" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
