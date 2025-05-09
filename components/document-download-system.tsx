"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, CheckCircle } from "lucide-react"

interface DownloadableDocument {
  id: string
  name: string
  description: string
  fileTypes: {
    type: string
    url: string
  }[]
}

interface DocumentDownloadProps {
  purchaseId: string
  documents: DownloadableDocument[]
  expiryDate: string
}

export function DocumentDownloadSystem({ purchaseId, documents, expiryDate }: DocumentDownloadProps) {
  const [downloadedDocs, setDownloadedDocs] = useState<Record<string, boolean>>({})

  const handleDownload = (docId: string, fileUrl: string) => {
    // In a real implementation, you might want to track downloads or verify purchase status
    // before allowing downloads

    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = fileUrl.split("/").pop() || "document"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Mark this document as downloaded
    setDownloadedDocs((prev) => ({
      ...prev,
      [docId]: true,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-teal-800">Your purchase was successful!</h3>
            <p className="text-sm text-teal-700">
              Order #{purchaseId} • Download links expire on {expiryDate}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {documents.map((doc) => (
          <Card key={doc.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{doc.name}</CardTitle>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                  <FileText className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-gray-500">Available in multiple formats</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t bg-gray-50 p-4">
              {doc.fileTypes.map((file) => (
                <Button
                  key={file.type}
                  variant={file.type === "docx" ? "default" : "outline"}
                  className={file.type === "docx" ? "bg-teal-600 hover:bg-teal-700 w-full" : "w-full"}
                  onClick={() => handleDownload(doc.id, file.url)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download {file.type.toUpperCase()}
                  {downloadedDocs[`${doc.id}-${file.type}`] && <CheckCircle className="ml-2 h-4 w-4" />}
                </Button>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>

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
  )
}
