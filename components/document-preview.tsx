"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileIcon as FileWord, FileIcon as FilePdf, Eye, Download, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DocumentPreviewProps {
  documentId: string
  documentName: string
  format: string
}

export function DocumentPreview({ documentId, documentName, format }: DocumentPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPreview = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get a temporary preview URL from the API
      const response = await fetch(`/api/documents/preview/${documentId}`)

      if (!response.ok) {
        throw new Error("Failed to load document preview")
      }

      const data = await response.json()
      setPreviewUrl(data.previewUrl)
    } catch (err: any) {
      console.error("Error loading preview:", err)
      setError(err.message || "Failed to load preview")
    } finally {
      setLoading(false)
    }
  }

  // Format-specific preview component
  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-md">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-500">Loading preview...</p>
        </div>
      )
    }

    if (error) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )
    }

    if (!previewUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-md">
          <div className="mb-6">
            {format === "pdf" ? (
              <FilePdf className="h-16 w-16 text-red-400" />
            ) : (
              <FileWord className="h-16 w-16 text-blue-400" />
            )}
          </div>
          <h3 className="text-lg font-medium mb-2">{documentName}</h3>
          <p className="text-sm text-gray-500 mb-6">Click the button below to preview this document</p>
          <Button onClick={loadPreview} className="bg-teal-600 hover:bg-teal-700">
            <Eye className="mr-2 h-4 w-4" />
            Preview Document
          </Button>
        </div>
      )
    }

    // For PDF files, we can embed them directly
    if (format === "pdf") {
      return (
        <div className="h-[600px] w-full">
          <object data={previewUrl} type="application/pdf" className="w-full h-full border rounded-md">
            <p>
              Your browser does not support PDF previews.{" "}
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                Click here to download the PDF.
              </a>
            </p>
          </object>
        </div>
      )
    }

    // For Word documents, we can't embed them directly, so offer a download or thumbnail
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-md">
        <FileWord className="h-16 w-16 text-blue-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">{documentName}</h3>
        <p className="text-sm text-gray-500 mb-6">Word documents cannot be previewed directly in the browser</p>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              Open in New Tab
            </a>
          </Button>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <a href={previewUrl} download={`${documentName}.docx`}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">{renderPreview()}</CardContent>
    </Card>
  )
}
