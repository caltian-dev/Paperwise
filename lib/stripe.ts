import Stripe from "stripe"

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // Use a specific API version
})

async function createCheckoutSession(document: any, userId: string) {
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: document.name,
            description: document.description,
          },
          unit_amount: Math.round(document.price * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      documentId: document.id,
      userId: userId,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/purchases`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/templates`,
  })

  return checkoutSession
}

export { createCheckoutSession, stripe }
