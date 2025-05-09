"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, X, Trash2, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export function FloatingCart() {
  const { items, removeItem, clearCart, itemCount, totalPrice, isCartOpen, setIsCartOpen } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const session = useSession()
  const [mounted, setMounted] = useState(false)

  // Only show cart after component has mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCheckout = async () => {
    if (session.status === "unauthenticated") {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your purchase",
      })
      router.push("/login?redirect=/checkout")
      return
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/checkout/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const { url } = await response.json()

      // Redirect to Stripe checkout
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

  if (!mounted) return null

  return (
    <>
      {/* Floating Cart Button */}
      <Button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-teal-600 hover:bg-teal-700 shadow-lg z-50 flex items-center justify-center"
        aria-label="Open cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>

      {/* Cart Slide-out Panel */}
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsCartOpen(false)} aria-hidden="true" />

          {/* Cart Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" /> Your Cart
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-gray-500">Your cart is empty</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsCartOpen(false)}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">${(item.price / 100).toFixed(2)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${(totalPrice / 100).toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={clearCart}>
                    Clear Cart
                  </Button>
                  <Button onClick={handleCheckout} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
                    {isLoading ? "Processing..." : "Checkout"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
