"use client"

import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Check, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import { DirectAddToCartButton } from "./direct-add-to-cart"
import Link from "next/link"

interface TemplatePreviewProps {
  template: string
  price: number
  documentId: string
}

export function TemplatePreview({ template, price, documentId }: TemplatePreviewProps) {
  const [showSample, setShowSample] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Update cart count when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const savedCart = localStorage.getItem("cart-items")
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          if (Array.isArray(parsedCart)) {
            setCartCount(parsedCart.length)
          }
        }
      } catch (error) {
        console.error("Failed to check cart count:", error)
      }
    }

    // Initial count
    updateCartCount()

    // Listen for storage events
    window.addEventListener("storage", updateCartCount)

    // Custom event for cart updates
    const handleCartUpdate = () => updateCartCount()
    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("storage", updateCartCount)
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  return (
    <div className="grid gap-6">
      <DialogHeader>
        <DialogTitle>{template}</DialogTitle>
        <DialogDescription>Preview this template before purchasing</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="preview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="details">What's Included</TabsTrigger>
          <TabsTrigger value="instructions">How to Use</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="border rounded-md p-4 min-h-[300px]">
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <FileText className="h-16 w-16 text-gray-300" />
            <p className="text-sm text-gray-500 text-center max-w-md">
              This is a preview of the {template}. The actual template is a professionally formatted document with
              proper legal language and customizable sections.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Button variant="outline" className="w-full" onClick={() => setShowSample(!showSample)}>
                <FileText className="mr-2 h-4 w-4" />
                {showSample ? "Hide Sample Page" : "View Sample Page"}
              </Button>
              <DirectAddToCartButton documentId={documentId} documentName={template} price={price} className="w-full" />
            </div>
            {showSample && (
              <div className="mt-4 border rounded-md p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Sample Page Preview</h4>
                <div className="prose prose-sm max-w-none">
                  <p>
                    <strong>{template}</strong>
                  </p>
                  <p>
                    This is a sample section of the {template.toLowerCase()}. The full document contains comprehensive
                    legal language tailored to protect your business interests.
                  </p>
                  <p className="text-gray-500 italic">
                    The actual document is professionally formatted with proper legal clauses, definitions, and
                    customizable fields highlighted for easy editing.
                  </p>
                  <div className="border-l-4 border-teal-500 pl-4 my-4">
                    <p className="text-sm">SECTION 1: PARTIES</p>
                    <p className="text-sm">
                      This agreement is made between <span className="bg-yellow-100 px-1">YOUR BUSINESS NAME</span>,
                      hereinafter referred to as "Company," and <span className="bg-yellow-100 px-1">CLIENT NAME</span>,
                      hereinafter referred to as "Client."
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    Note: This is just a sample section. The complete document is more comprehensive.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="details" className="border rounded-md p-4 min-h-[300px]">
          <div className="space-y-4">
            <h3 className="font-medium">What's Included in This Template</h3>
            <ul className="space-y-2">
              {[
                "Complete, attorney-drafted legal document",
                "Word (.docx) format",
                "Easy-to-follow customization instructions",
                "Highlighted sections for personalization",
                "7-day money-back guarantee",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <h3 className="font-medium pt-2">Template Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Format:</p>
                <p>Word</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated:</p>
                <p>May 2025</p>
              </div>
              <div>
                <p className="text-gray-500">Jurisdiction:</p>
                <p>United States</p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="instructions" className="border rounded-md p-4 min-h-[300px]">
          <div className="space-y-4">
            <h3 className="font-medium">How to Use This Template</h3>
            <ol className="space-y-3 list-decimal pl-5">
              <li className="text-sm">
                <span className="font-medium">Purchase and Download</span>
                <p className="text-gray-500">
                  After purchase, you'll receive an email with a download link for the Word document.
                </p>
              </li>
              <li className="text-sm">
                <span className="font-medium">Open the Word Document</span>
                <p className="text-gray-500">Use Microsoft Word or a compatible program to open the .docx file.</p>
              </li>
              <li className="text-sm">
                <span className="font-medium">Follow the Instructions</span>
                <p className="text-gray-500">
                  Yellow highlighted sections indicate where you need to add your specific information.
                </p>
              </li>
              <li className="text-sm">
                <span className="font-medium">Customize as Needed</span>
                <p className="text-gray-500">Add, remove, or modify sections to fit your specific business needs.</p>
              </li>
              <li className="text-sm">
                <span className="font-medium">Save and Use</span>
                <p className="text-gray-500">
                  Once customized, save the document and it's ready to use for your business.
                </p>
              </li>
            </ol>
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mt-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> While our templates are professionally drafted, we recommend consulting with an
                attorney for complex situations or if you have specific legal concerns.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center border-t pt-4">
        <div>
          <p className="font-medium">${price}</p>
          <p className="text-xs text-gray-500">One-time purchase</p>
        </div>
        <div className="flex gap-2">
          <DirectAddToCartButton documentId={documentId} documentName={template} price={price} />
          <Button asChild variant="outline">
            <Link href="/cart">
              <ShoppingCart className="mr-2 h-4 w-4" />
              View Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
