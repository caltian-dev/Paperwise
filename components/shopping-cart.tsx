"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, X, CreditCard } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function ShoppingCartButton() {
  const { items, removeItem, clearCart, itemCount, total } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      // Check if user is logged in first
      const authCheckResponse = await fetch("/api/auth/check")
      const authData = await authCheckResponse.json()

      if (!authData?.authenticated) {
        // Redirect to login page with return URL
        router.push(`/login?returnUrl=${encodeURIComponent("/cart")}`)
        return
      }

      // For multiple items, use the cart checkout endpoint
      const response = await fetch("/api/checkout/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create checkout session")
      }

      const { url } = await response.json()

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <p className="text-sm text-gray-400 mt-2">Browse our templates to find legal documents for your business</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto py-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-auto">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>

              <div className="grid gap-2">
                <Button onClick={handleCheckout} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isLoading ? "Processing..." : "Checkout"}
                </Button>
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button asChild variant="link">
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
