"use client"

import { ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CartIcon() {
  const [count, setCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const updateCount = () => {
      try {
        const savedCart = localStorage.getItem("cart-items")
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          if (Array.isArray(parsedCart)) {
            setCount(parsedCart.length)
          }
        }
      } catch (error) {
        console.error("Failed to get cart count:", error)
      }
    }

    // Initial count
    updateCount()

    // Listen for storage events
    window.addEventListener("storage", updateCount)

    // Custom event for cart updates
    const handleCartUpdate = () => updateCount()
    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("storage", updateCount)
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {count}
          </span>
        )}
        <span className="sr-only">Cart</span>
      </Link>
    </Button>
  )
}
