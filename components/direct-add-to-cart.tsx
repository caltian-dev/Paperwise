"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, Plus, Minus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"

interface DirectAddToCartButtonProps {
  documentId: string
  documentName: string
  price: number
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showQuantity?: boolean
}

export function DirectAddToCartButton({
  documentId,
  documentName,
  price,
  variant = "default",
  size = "default",
  className = "",
  showQuantity = false,
}: DirectAddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { status } = useSession()

  // Check if item is already in cart on component mount
  useEffect(() => {
    if (status === "loading") return

    try {
      if (status === "authenticated") {
        // For logged-in users, check database cart
        fetch("/api/cart")
          .then((response) => response.json())
          .then((data) => {
            if (data.items && Array.isArray(data.items)) {
              const existingItem = data.items.find((item: any) => item.documentId === documentId)
              if (existingItem) {
                setIsAdded(true)
                setQuantity(existingItem.quantity)
              }
            }
          })
          .catch((error) => {
            console.error("Failed to check cart:", error)
            checkLocalStorage()
          })
      } else {
        // For anonymous users, check localStorage
        checkLocalStorage()
      }
    } catch (error) {
      console.error("Failed to check cart:", error)
      checkLocalStorage()
    }
  }, [documentId, status])

  const checkLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem("cart-items")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          const existingItem = parsedCart.find((item) => item.id === documentId)
          if (existingItem) {
            setIsAdded(true)
            setQuantity(existingItem.quantity || 1)
          }
        }
      }
    } catch (error) {
      console.error("Failed to check localStorage cart:", error)
    }
  }

  const handleAddToCart = async () => {
    try {
      setIsLoading(true)
      console.log("Adding to cart:", { documentId, documentName, price, quantity })

      if (status === "authenticated") {
        // For logged-in users, use API
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentId,
            quantity,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to add item to cart")
        }

        // Update state
        setIsAdded(true)
      } else {
        // For anonymous users, use localStorage
        // Get current cart
        let currentCart = []
        try {
          const savedCart = localStorage.getItem("cart-items")
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart)
            if (Array.isArray(parsedCart)) {
              currentCart = parsedCart
            }
          }
        } catch (error) {
          console.error("Failed to load cart:", error)
        }

        // Check if item already exists
        const existingItemIndex = currentCart.findIndex((item: any) => item.id === documentId)

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          currentCart[existingItemIndex].quantity = (currentCart[existingItemIndex].quantity || 1) + quantity
        } else {
          // Add new item
          currentCart.push({
            id: documentId,
            name: documentName,
            price: price,
            quantity: quantity,
          })
        }

        // Save to localStorage
        localStorage.setItem("cart-items", JSON.stringify(currentCart))
        console.log("Saved cart to localStorage:", currentCart)

        // Update state
        setIsAdded(true)
      }

      // Show toast
      toast({
        title: "Added to cart",
        description: `${documentName} has been added to your cart.`,
      })

      // Dispatch custom event for cart updates
      window.dispatchEvent(new Event("cartUpdated"))
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  return (
    <div className={`flex ${showQuantity ? "items-center gap-2" : ""}`}>
      {showQuantity && (
        <div className="flex items-center border rounded-md">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isLoading || isAdded}
          >
            <Minus className="h-3 w-3" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={incrementQuantity}
            disabled={isLoading || isAdded}
          >
            <Plus className="h-3 w-3" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      )}
      <Button
        onClick={handleAddToCart}
        disabled={isLoading || isAdded}
        variant={variant}
        size={size}
        className={`${isAdded ? "bg-green-600 hover:bg-green-700" : "bg-teal-600 hover:bg-teal-700"} ${className}`}
      >
        {isLoading ? (
          "Adding..."
        ) : isAdded ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  )
}
