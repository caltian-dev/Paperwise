"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, AlertCircle, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

// Define checkout states
type CheckoutState = "loading" | "ready" | "processing" | "success" | "error"

export default function CheckoutPage() {
  const { items: cartItems, clearCart, totalPrice } = useCart()
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Check authentication and load cart
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check")
        const data = await response.json()
        setIsAuthenticated(data.authenticated)

        if (data.authenticated && data.user) {
          setEmail(data.user.email || "")
          setName(data.user.name || "")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsAuthenticated(false)
      }
    }

    const loadCart = () => {
      // Redirect to cart if empty
      if (cartItems.length === 0) {
        router.push("/cart")
        toast({
          title: "Empty Cart",
          description: "Your cart is empty. Please add items before checkout.",
        })
      }
    }

    Promise.all([checkAuth(), loadCart()])
      .then(() => setCheckoutState("ready"))
      .catch(() => {
        setErrorMessage("Failed to initialize checkout. Please try again.")
        setCheckoutState("error")
      })
  }, [router, toast, cartItems.length])

  // Handle checkout submission
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent("/checkout")}`)
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    try {
      setCheckoutState("processing")

      // Create a checkout session for all items in cart
      const response = await fetch("/api/checkout/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
        }),
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create checkout session")
        } else {
          const errorText = await response.text()
          console.error("Non-JSON error response:", errorText)
          throw new Error(`Server error: ${response.status} ${response.statusText}`)
        }
      }

      const { url } = await response.json()

      if (url) {
        // Clear cart after successful checkout
        clearCart()
        // Redirect to Stripe
        window.location.href = url
      } else {
        throw new Error("Invalid checkout URL received")
      }
    } catch (error: any) {
      console.error("Checkout error:", error)
      setErrorMessage(error.message || "Something went wrong. Please try again.")
      setCheckoutState("error")
      toast({
        title: "Checkout Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Render based on checkout state
  const renderCheckoutState = () => {
    switch (checkoutState) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-teal-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        )

      case "processing":
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-teal-600 animate-spin mb-4" />
            <p className="text-gray-600">Processing your order...</p>
            <p className="text-sm text-gray-500 mt-2">Please do not close this page.</p>
          </div>
        )

      case "success":
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Order Successful!</h2>
            <p className="text-gray-600 mb-6 text-center">
              Thank you for your purchase. You will receive an email with your download links shortly.
            </p>
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/purchases">View My Purchases</Link>
            </Button>
          </div>
        )

      case "error":
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Checkout Failed</h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">{errorMessage}</p>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href="/cart">Return to Cart</Link>
              </Button>
              <Button onClick={() => setCheckoutState("ready")} className="bg-teal-600 hover:bg-teal-700">
                Try Again
              </Button>
            </div>
          </div>
        )

      case "ready":
      default:
        return (
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Checkout Details</CardTitle>
                  <CardDescription>
                    {isAuthenticated ? "Review your information below" : "Please log in to complete your purchase"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isAuthenticated ? (
                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                      <p className="text-yellow-800 font-medium">You need to be logged in to checkout</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Please log in or create an account to continue with your purchase.
                      </p>
                      <Button
                        className="mt-3 bg-yellow-600 hover:bg-yellow-700"
                        onClick={() => router.push(`/login?returnUrl=${encodeURIComponent("/checkout")}`)}
                      >
                        Log In to Continue
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          disabled={checkoutState === "processing"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          disabled={true}
                        />
                        <p className="text-xs text-gray-500">
                          Your purchase confirmation and download links will be sent to this email.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="outline">
                    <Link href="/cart">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
                    </Link>
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    disabled={checkoutState === "processing" || !isAuthenticated}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {checkoutState === "processing" ? "Processing..." : "Complete Purchase"}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 border-b">
                      <span>{item.name}</span>
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="flex justify-between pt-2 font-bold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="container max-w-6xl py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      {renderCheckoutState()}
    </div>
  )
}
