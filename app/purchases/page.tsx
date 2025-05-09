"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Calendar } from "lucide-react"

interface Purchase {
  id: string
  status: string
  amount: number
  downloadCount: number
  expiresAt: string
  createdAt: string
  document: {
    id: string
    name: string
    description: string
    formats: string[]
    category: string
  }
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch("/api/purchases")
        if (!response.ok) {
          throw new Error("Failed to fetch purchases")
        }

        const data = await response.json()
        setPurchases(data.purchases)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Your Purchases</h1>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't made any purchases yet.</p>
          <Button asChild>
            <Link href="/templates">Browse Templates</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{purchase.document.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{purchase.document.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Purchased on {new Date(purchase.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Expires on {new Date(purchase.expiresAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 p-4">
                <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                  <Link href={`/download/${purchase.id}`}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Documents
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
