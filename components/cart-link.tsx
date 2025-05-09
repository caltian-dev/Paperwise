"use client"

import { useCart } from "@/contexts/cart-context"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export function CartLink() {
  const { itemCount } = useCart()

  if (itemCount === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        href="/cart"
        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full shadow-lg transition-colors"
      >
        <ShoppingCart size={18} />
        <span>
          Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
        </span>
      </Link>
    </div>
  )
}
