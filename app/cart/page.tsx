"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Trash2, ArrowLeft, ArrowRight, Plus, Minus } from "lucide-react"
import { RelatedProducts } from "@/components/related-products"

// Define cart item type
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { data: session, status } = useSession()

  // Calculate total price
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Load cart from localStorage or database
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (status === "authenticated") {
          // For logged-in users, fetch from database
          const response = await fetch("/api/cart")

          if (response.ok) {
            const data = await response.json()

            if (data.items && Array.isArray(data.items)) {
              const formattedItems = data.items.map((item: any) => ({
                id: item.documentId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              }))

              setItems(formattedItems)
            }
          } else {
            // Fall back to localStorage
            loadFromLocalStorage()
          }
        } else {
          // For anonymous users, use localStorage
          loadFromLocalStorage()
        }
      } catch (error) {
        console.error("Failed to load cart:", error)
        // Fall back to localStorage
        loadFromLocalStorage()
      } finally {
        setIsInitialized(true)
      }
    }

    const loadFromLocalStorage = () => {
      try {
        const savedCart = localStorage.getItem("cart-items")
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          if (Array.isArray(parsedCart)) {
            // Ensure all items have a quantity property
            const formattedItems = parsedCart.map((item) => ({
              ...item,
              quantity: item.quantity || 1,
            }))
            setItems(formattedItems)
          }
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }

    // Only load cart when session status is determined
    if (status !== "loading") {
      loadCart()
    }
  }, [status])

  // Update item quantity
  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or negative
      removeItem(id)
      return
    }

    // Update item quantity
    const newItems = items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))

    setItems(newItems)

    // Update localStorage for anonymous users
    if (status !== "authenticated") {
      try {
        localStorage.setItem("cart-items", JSON.stringify(newItems))
      } catch (error) {
        console.error("Failed to update cart in localStorage:", error)
      }
    } else {
      // Update database for logged-in users
      try {
        const response = await fetch("/api/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentId: id,
            quantity: newQuantity,
          }),
        })

        if (!response.ok) {
          console.error("Failed to update item quantity in database")
        }
      } catch (error) {
        console.error("Error updating item quantity in database:", error)
      }
    }

    // Dispatch custom event for cart updates
    window.dispatchEvent(new Event("cartUpdated"))
  }

  // Remove item from cart
  const removeItem = async (id: string) => {
    const newItems = items.filter((item) => item.id !== id)
    setItems(newItems)

    // Update localStorage for anonymous users
    if (status !== "authenticated") {
      try {
        localStorage.setItem("cart-items", JSON.stringify(newItems))
      } catch (error) {
        console.error("Failed to update cart in localStorage:", error)
      }
    } else {
      // Update database for logged-in users
      try {
        const response = await fetch(`/api/cart?documentId=${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          console.error("Failed to remove item from database")
        }
      } catch (error) {
        console.error("Error removing item from database:", error)
      }
    }

    // Dispatch custom event for cart updates
    window.dispatchEvent(new Event("cartUpdated"))
  }

  // Clear entire cart
  const clearCart = async () => {
    setItems([])

    // Update localStorage for anonymous users
    if (status !== "authenticated") {
      try {
        localStorage.setItem("cart-items", JSON.stringify([]))
      } catch (error) {
        console.error("Failed to clear cart in localStorage:", error)
      }
    } else {
      // Update database for logged-in users
      try {
        const response = await fetch("/api/cart?clearAll=true", {
          method: "DELETE",
        })

        if (!response.ok) {
          console.error("Failed to clear database cart")
        }
      } catch (error) {
        console.error("Error clearing database cart:", error)
      }
    }

    // Dispatch custom event for cart updates
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const handleCheckout = async () => {
    if (status === "unauthenticated") {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your purchase",
        variant: "destructive",
      })
      router.push(`/login?returnUrl=${encodeURIComponent("/cart")}`)
      return
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out",
        variant: "destructive",
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
        body: JSON.stringify({ items }),
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

  if (!isInitialized) {
    return <div className="container max-w-4xl py-12">Loading cart...</div>
  }

  if (items.length === 0) {
    return (
      <div className="container max-w-4xl py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any documents to your cart yet.</p>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link href="/">Browse Templates</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-medium mb-4">Cart Items ({totalItems})</h2>
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex justify-between items-center">
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-md">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-between">
              <Button variant="outline" size="sm" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Related products section */}
          {items.length > 0 && (
            <div className="mt-8">
              <RelatedProducts documentId={items[0].id} />
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-medium mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2 font-medium flex justify-between">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Button onClick={handleCheckout} disabled={isLoading} className="w-full bg-teal-600 hover:bg-teal-700">
              {isLoading ? "Processing..." : "Proceed to Checkout"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="mt-4 text-xs text-gray-500">
              <p className="mb-2">Your cart will expire after 30 days of inactivity.</p>
              <p>By proceeding to checkout, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
