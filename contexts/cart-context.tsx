"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

// Define cart item type
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

// Define cart context type
interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  totalPrice: number
  isLoading: boolean
  isSyncing: boolean
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  totalPrice: 0,
  isLoading: false,
  isSyncing: false,
})

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext)

// Cart provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const { data: session, status } = useSession()
  const { toast } = useToast()

  // Calculate derived values
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Load cart from localStorage or database
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true)

        if (status === "authenticated" && session?.user?.id) {
          // Fetch cart from database for logged-in users
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
              console.log("Loaded cart from database:", formattedItems)

              // Sync local cart with database
              syncLocalCartWithDatabase()
            }
          } else {
            console.error("Failed to fetch cart from database")
            // Fall back to localStorage
            loadFromLocalStorage()
          }
        } else {
          // Use localStorage for anonymous users
          loadFromLocalStorage()
        }
      } catch (error) {
        console.error("Failed to load cart:", error)
        // Fall back to localStorage
        loadFromLocalStorage()
      } finally {
        setIsLoading(false)
        setLoaded(true)
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
            console.log("Loaded cart from localStorage:", formattedItems)
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
  }, [status, session?.user?.id])

  // Sync local cart with database when user logs in
  const syncLocalCartWithDatabase = async () => {
    if (status !== "authenticated" || !session?.user?.id) return

    try {
      setIsSyncing(true)

      // Get local cart items
      const savedCart = localStorage.getItem("cart-items")
      if (!savedCart) return

      const localItems = JSON.parse(savedCart)
      if (!Array.isArray(localItems) || localItems.length === 0) return

      // Format items for API
      const itemsToSync = localItems.map((item) => ({
        id: item.id,
        quantity: item.quantity || 1,
      }))

      // Send to API
      const response = await fetch("/api/cart/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: itemsToSync }),
      })

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
          console.log("Synced cart with database:", formattedItems)

          // Clear localStorage after successful sync
          localStorage.removeItem("cart-items")
        }
      } else {
        console.error("Failed to sync cart with database")
      }
    } catch (error) {
      console.error("Failed to sync cart:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (loaded && status !== "authenticated") {
      try {
        localStorage.setItem("cart-items", JSON.stringify(items))
        console.log("Saved cart to localStorage:", items)
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error)
      }
    }
  }, [items, loaded, status])

  // Add item to cart
  const addItem = async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    console.log("Adding item to cart:", item)
    const quantity = item.quantity || 1

    // Check if item already exists
    const existingItemIndex = items.findIndex((i) => i.id === item.id)

    let newItems: CartItem[]

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      newItems = [...items]
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + quantity,
      }
    } else {
      // Add new item
      newItems = [...items, { ...item, quantity }]
    }

    setItems(newItems)

    // If user is logged in, update database
    if (status === "authenticated" && session?.user?.id) {
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentId: item.id,
            quantity,
          }),
        })

        if (!response.ok) {
          console.error("Failed to add item to database cart")
        }
      } catch (error) {
        console.error("Error adding item to database cart:", error)
      }
    }

    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  // Update item quantity
  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      removeItem(id)
      return
    }

    // Update item quantity
    const newItems = items.map((item) => (item.id === id ? { ...item, quantity } : item))

    setItems(newItems)

    // If user is logged in, update database
    if (status === "authenticated" && session?.user?.id) {
      try {
        const response = await fetch("/api/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentId: id,
            quantity,
          }),
        })

        if (!response.ok) {
          console.error("Failed to update item quantity in database cart")
        }
      } catch (error) {
        console.error("Error updating item quantity in database cart:", error)
      }
    }
  }

  // Remove item from cart
  const removeItem = async (id: string) => {
    const newItems = items.filter((item) => item.id !== id)
    setItems(newItems)

    // If user is logged in, update database
    if (status === "authenticated" && session?.user?.id) {
      try {
        const response = await fetch(`/api/cart?documentId=${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          console.error("Failed to remove item from database cart")
        }
      } catch (error) {
        console.error("Error removing item from database cart:", error)
      }
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    setItems([])

    // If user is logged in, update database
    if (status === "authenticated" && session?.user?.id) {
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
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        totalPrice,
        isLoading,
        isSyncing,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
