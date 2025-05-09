"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Upload, FileText } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LegalDocumentPdfUpload() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("privacy-policy")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError("Please select a PDF file")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("documentType", documentType)

    try {
      const response = await fetch("/api/admin/legal/pdf-upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload PDF")
      }

      setSuccess(`${selectedFile.name} uploaded successfully!`)
      setSelectedFile(null)

      // Reset the file input
      const fileInput = document.getElementById("pdf-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (err) {
      console.error("Error uploading PDF:", err)
      setError("Failed to upload PDF. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Upload Legal Document PDF</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Upload Legal Document PDF
          </CardTitle>
          <CardDescription>
            Upload a PDF version of your legal document. The PDF will be displayed on your website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="document-type">Document Type</Label>
              <select
                id="document-type"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="privacy-policy">Privacy Policy</option>
                <option value="terms-of-service">Terms of Service</option>
                <option value="disclaimer">Disclaimer</option>
                <option value="cookie-policy">Cookie Policy</option>
              </select>
            </div>

            <div>
              <Label htmlFor="pdf-upload">PDF File</Label>
              <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} className="cursor-pointer" />
              <p className="text-sm text-muted-foreground mt-1">Upload a PDF file (max 10MB)</p>
            </div>

            <Button type="submit" disabled={isLoading || !selectedFile} className="flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              {isLoading ? "Uploading..." : "Upload PDF"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
