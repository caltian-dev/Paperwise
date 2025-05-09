"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ZipUploadProcessor } from "@/components/zip-upload-processor"

export default function ZipUploadPage() {
  const [uploadComplete, setUploadComplete] = useState(false)

  const handleUploadComplete = (results: any) => {
    setUploadComplete(true)
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <Link href="/admin/documents" className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">ZIP Document Upload</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents via ZIP</CardTitle>
          </CardHeader>
          <CardContent>
            <ZipUploadProcessor onComplete={handleUploadComplete} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ZIP Upload Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">How to Use ZIP Upload</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Download the ZIP template using the button above</li>
                <li>
                  The template contains:
                  <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                    <li>A CSV file with document metadata</li>
                    <li>Sample placeholder document files</li>
                    <li>A README with detailed instructions</li>
                  </ul>
                </li>
                <li>Replace the placeholder files with your actual document files</li>
                <li>
                  Update the CSV with your document information:
                  <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                    <li>
                      <strong>name</strong>: Document name
                    </li>
                    <li>
                      <strong>description</strong>: Brief description
                    </li>
                    <li>
                      <strong>price</strong>: Price in dollars (e.g., 49.99)
                    </li>
                    <li>
                      <strong>category</strong>: One of: business, contracts, employment, realestate, website
                    </li>
                    <li>
                      <strong>format</strong>: File format (pdf or docx)
                    </li>
                    <li>
                      <strong>filename</strong>: Exact filename of the document in the ZIP
                    </li>
                  </ul>
                </li>
                <li>Save the CSV file back into the ZIP</li>
                <li>Upload the ZIP file using the form</li>
                <li>Click "Process ZIP File" to upload all documents</li>
              </ol>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-1">Benefits of ZIP Upload</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Upload multiple documents and their metadata in one step</li>
                <li>Automatically match document files with their metadata</li>
                <li>Save time with batch processing</li>
                <li>Detailed results and error reporting</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {uploadComplete && (
        <div className="mt-8 flex justify-center">
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link href="/admin/documents">Return to Document Management</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
