"use client"

import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CartDebug() {
  const { items, addItem, clearCart } = useCart()
  const [isVisible, setIsVisible] = useState(false)

  const addTestItem = () => {
    addItem({
      id: `test-${Date.now()}`,
      name: `Test Item ${items.length + 1}`,
      price: 9.99,
    })
  }

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-white"
      >
        Debug Cart
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white border rounded-md shadow-lg max-w-md">
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">Cart Debug</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
          Close
        </Button>
      </div>

      <div className="mb-2">
        <strong>Items in cart:</strong> {items.length}
      </div>

      {items.length > 0 ? (
        <ul className="mb-4 max-h-40 overflow-auto">
          {items.map((item, index) => (
            <li key={index} className="text-sm">
              {item.name} - ${item.price} (ID: {item.id})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm mb-4">No items in cart</p>
      )}

      <div className="flex gap-2">
        <Button size="sm" onClick={addTestItem}>
          Add Test Item
        </Button>
        <Button size="sm" variant="destructive" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>
    </div>
  )
}
