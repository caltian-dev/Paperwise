"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/cart-context"

interface AddToCartButtonProps {
  documentId: string
  documentName: string
  price: number
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function AddToCartButton({
  documentId,
  documentName,
  price,
  variant = "default",
  size = "default",
  className = "",
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { addItem, items } = useCart()

  // Check if item is already in cart
  const isInCart = items.some((item) => item.id === documentId)

  const handleAddToCart = () => {
    try {
      setIsLoading(true)
      console.log("Adding to cart:", { documentId, documentName, price })

      if (!isInCart) {
        // Add item to cart
        addItem({
          id: documentId,
          name: documentName,
          price: price,
        })

        // Show toast
        toast({
          title: "Added to cart",
          description: `${documentName} has been added to your cart.`,
        })
      } else {
        toast({
          title: "Already in cart",
          description: `${documentName} is already in your cart.`,
        })
      }
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

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading || isInCart}
      variant={variant}
      size={size}
      className={`${isInCart ? "bg-green-600 hover:bg-green-700" : "bg-teal-600 hover:bg-teal-700"} ${className}`}
    >
      {isLoading ? (
        "Adding..."
      ) : isInCart ? (
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
  )
}
