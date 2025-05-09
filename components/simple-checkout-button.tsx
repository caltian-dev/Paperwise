"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SimpleCheckoutButtonProps {
  productId: string
  productName: string
  price: number
}

export function SimpleCheckoutButton({ productId, productName, price }: SimpleCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/checkout/simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productName, price }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
      {isLoading ? "Processing..." : "Buy Now"}
    </Button>
  )
}
