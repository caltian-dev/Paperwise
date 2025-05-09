"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DirectAddToCartButton } from "./direct-add-to-cart"
import { FileText } from "lucide-react"

interface RelatedProduct {
  id: string
  name: string
  price: number
  category: string
  description?: string
}

interface RelatedProductsProps {
  documentId: string
  className?: string
}

export function RelatedProducts({ documentId, className = "" }: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/documents/related/${documentId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch related products")
        }

        const data = await response.json()

        if (data.documents && Array.isArray(data.documents)) {
          setProducts(data.documents)
        }
      } catch (error) {
        console.error("Error fetching related products:", error)
        setError("Failed to load related products")
      } finally {
        setIsLoading(false)
      }
    }

    if (documentId) {
      fetchRelatedProducts()
    }
  }, [documentId])

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-medium">You might also like</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 h-40"></CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || products.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium">You might also like</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center bg-gray-100 rounded-md p-4 mb-3">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="font-medium line-clamp-2 mb-1">{product.name}</h4>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="font-medium">${product.price.toFixed(2)}</span>
                  <DirectAddToCartButton
                    documentId={product.id}
                    documentName={product.name}
                    price={product.price}
                    size="sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
