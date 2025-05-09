"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { DocumentPreview } from "@/components/document-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, FileText, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DocumentDetailsPage() {
  const params = useParams()
  const documentId = params.id as string

  const [document, setDocument] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}`)

        if (!response.ok) {
          throw new Error("Failed to load document details")
        }

        const data = await response.json()
        setDocument(data)
      } catch (err: any) {
        console.error("Error loading document:", err)
        setError(err.message || "Failed to load document details")
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [documentId])

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-500">Loading document details...</p>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="container mx-auto py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
          <h2 className="text-lg font-medium mb-2">Error</h2>
          <p>{error || "Failed to load document"}</p>
          <Link href="/admin/documents" className="text-red-600 hover:underline mt-4 inline-block">
            Return to documents
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <Link href="/admin/documents" className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Document Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="text-lg">{document.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <Badge variant="outline" className="mt-1">
                  {document.category}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                <p className="text-lg">${Number.parseFloat(document.price).toFixed(2)}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Format</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant={document.format === "pdf" ? "default" : "outline"} className="bg-red-600">
                    PDF
                  </Badge>
                  <Badge variant={document.format === "docx" ? "default" : "outline"} className="bg-blue-600">
                    Word
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="text-sm mt-1">{document.description}</p>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Document
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Document Preview</h2>
          <DocumentPreview documentId={document.id} documentName={document.name} format={document.format} />
        </div>
      </div>
    </div>
  )
}
