"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, ArrowLeft, Check } from "lucide-react"

interface PurchaseDetails {
  purchase: {
    id: string
    status: string
    amount: number
    downloadCount: number
    expiresAt: string
    createdAt: string
  }
  document: {
    id: string
    name: string
    description: string
    formats: string[]
    category: string
  }
}

export default function DownloadPage() {
  const params = useParams()
  const purchaseId = params.purchaseId as string
  const [details, setDetails] = useState<PurchaseDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadStatus, setDownloadStatus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      try {
        const response = await fetch(`/api/purchases/${purchaseId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch purchase details")
        }

        const data = await response.json()
        setDetails(data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchPurchaseDetails()
  }, [purchaseId])

  const handleDownload = async (format: string) => {
    try {
      if (!details) return

      const response = await fetch(`/api/documents/download?documentId=${details.document.id}&purchaseId=${purchaseId}`)
      if (!response.ok) {
        throw new Error("Failed to generate download link")
      }

      const data = await response.json()

      // Open the download link in a new tab
      window.open(data.url, "_blank")

      // Mark this format as downloaded
      setDownloadStatus((prev) => ({
        ...prev,
        [format]: true,
      }))
    } catch (err: any) {
      setError(err.message)
    }
  }

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
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/purchases">Return to Purchases</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!details) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <p className="text-gray-500">Purchase not found</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/purchases">Return to Purchases</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <Button variant="ghost" size="sm" className="mb-8" asChild>
        <Link href="/purchases">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to purchases
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Download Your Documents</h1>

        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 mb-8">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-teal-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-teal-800">Your purchase was successful!</h3>
              <p className="text-sm text-teal-700">
                Order #{details.purchase.id.substring(0, 8)} • Download links expire on{" "}
                {new Date(details.purchase.expiresAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden mb-8">
          <CardHeader>
            <CardTitle>{details.document.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-6">{details.document.description}</p>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                <FileText className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{details.document.name}</p>
                <p className="text-xs text-gray-500">Available in multiple formats</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t bg-gray-50 p-4">
            {details.document.formats.includes("docx") && (
              <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => handleDownload("docx")}>
                <Download className="mr-2 h-4 w-4" />
                Download DOCX
                {downloadStatus["docx"] && <Check className="ml-2 h-4 w-4" />}
              </Button>
            )}

            {details.document.formats.includes("pdf") && (
              <Button variant="outline" className="w-full" onClick={() => handleDownload("pdf")}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
                {downloadStatus["pdf"] && <Check className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you have any issues downloading your documents or need assistance with customization, our support team is
            here to help.
          </p>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}
