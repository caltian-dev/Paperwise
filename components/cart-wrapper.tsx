"use client"

import type React from "react"

import { CartProvider } from "@/contexts/cart-context"
import { FloatingCart } from "@/components/floating-cart"

export function CartWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <FloatingCart />
    </CartProvider>
  )
}
