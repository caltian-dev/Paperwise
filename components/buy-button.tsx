"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface BuyButtonProps {
  productId: string
  productName: string
  price: number
}

export function BuyButton({ productId, productName, price }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const session = useSession()

  const handleBuyNow = async () => {
    if (session.status === "unauthenticated") {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a purchase",
        variant: "destructive",
      })
      router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/checkout/direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          productName,
          price,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "An unknown error occurred" }))
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleBuyNow} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
      {isLoading ? "Processing..." : "Buy Now"}
    </Button>
  )
}
