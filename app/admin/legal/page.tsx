"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Upload, FileText, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LegalDocumentsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("privacy-policy")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documents, setDocuments] = useState<any>({
    "privacy-policy": { title: "Privacy Policy", pdfUrl: "", lastUpdated: "" },
    "terms-of-service": { title: "Terms of Service", pdfUrl: "", lastUpdated: "" },
    disclaimer: { title: "Disclaimer", pdfUrl: "", lastUpdated: "" },
    "cookie-policy": { title: "Cookie Policy", pdfUrl: "", lastUpdated: "" },
  })

  // Check authentication on page load
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/admin-login")
    } else {
      // Initialize the database table
      initializeDatabase()
      // Load existing legal documents
      fetchLegalDocuments()
    }
  }, [router])

  // Initialize the database table
  const initializeDatabase = async () => {
    setIsInitializing(true)
    try {
      await fetch("/api/admin/legal/init", {
        method: "POST",
      })
    } catch (err) {
      console.error("Error initializing database:", err)
    } finally {
      setIsInitializing(false)
    }
  }

  // Fetch existing legal documents
  const fetchLegalDocuments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/legal")
      if (!response.ok) {
        throw new Error("Failed to fetch legal documents")
      }

      const data = await response.json()

      // Update state with fetched data
      const updatedDocuments = { ...documents }

      Object.keys(data).forEach((key) => {
        if (data[key] && updatedDocuments[key]) {
          updatedDocuments[key] = data[key]
        }
      })

      setDocuments(updatedDocuments)
    } catch (err) {
      console.error("Error fetching legal documents:", err)
      setError("Failed to load legal documents. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
    formData.append("documentType", activeTab)

    try {
      const response = await fetch("/api/admin/legal/pdf-upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload PDF")
      }

      const data = await response.json()

      setSuccess(`${selectedFile.name} uploaded successfully!`)
      setSelectedFile(null)

      // Reset the file input
      const fileInput = document.getElementById("pdf-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      // Refresh the documents list
      fetchLegalDocuments()
    } catch (err: any) {
      console.error("Error uploading PDF:", err)
      setError(err.message || "Failed to upload PDF. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getDocumentTitle = (docType: string) => {
    return docType
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Legal Documents</h1>

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

      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLegalDocuments}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="privacy-policy" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="privacy-policy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="terms-of-service">Terms of Service</TabsTrigger>
          <TabsTrigger value="disclaimer">Disclaimer</TabsTrigger>
          <TabsTrigger value="cookie-policy">Cookie Policy</TabsTrigger>
        </TabsList>

        {Object.keys(documents).map((docType) => (
          <TabsContent key={docType} value={docType}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  {getDocumentTitle(docType)}
                </CardTitle>
                <CardDescription>
                  Upload a PDF version of your {getDocumentTitle(docType).toLowerCase()}.
                  {documents[docType].lastUpdated && (
                    <span className="block mt-1">Last updated: {documents[docType].lastUpdated}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="pdf-upload">PDF File</Label>
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Upload a PDF file (max 10MB)</p>
                  </div>

                  <Button type="submit" disabled={isLoading || !selectedFile} className="flex items-center">
                    <Upload className="mr-2 h-4 w-4" />
                    {isLoading ? "Uploading..." : "Upload PDF"}
                  </Button>

                  {documents[docType].pdfUrl && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Current PDF:</h3>
                      <div className="border rounded-md p-4">
                        <p className="text-sm break-all">{documents[docType].pdfUrl}</p>
                        <div className="mt-2">
                          <a
                            href={documents[docType].pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View PDF
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
