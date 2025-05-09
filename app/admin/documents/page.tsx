"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileArchive,
  FileSpreadsheet,
  Package,
  FileText,
  Upload,
  Trash,
  ArrowLeft,
  UploadCloud,
  AlertCircle,
  CloudOff,
  Sparkles,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AdminDocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Bulk delete state
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Single upload form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState("")

  // Bulk upload form state
  const [bulkFiles, setBulkFiles] = useState<File[]>([])
  const [bulkCategory, setBulkCategory] = useState("")
  const [bulkFormat, setBulkFormat] = useState("")
  const [bulkBasePrice, setBulkBasePrice] = useState("")
  const [bulkUploading, setBulkUploading] = useState(false)
  const [bulkProgress, setBulkProgress] = useState(0)

  // For simplicity, we'll use a hardcoded admin check for now
  // In production, you should implement proper authentication
  const [isAdmin, setIsAdmin] = useState(true)

  useEffect(() => {
    // Simplified approach - just fetch documents
    fetchDocuments()
    setIsLoading(false)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      console.log("File selected:", selectedFile.name, selectedFile.type, selectedFile.size)

      // Auto-detect format from file extension
      const fileName = selectedFile.name
      const extension = fileName.split(".").pop()?.toLowerCase()
      if (extension === "pdf") {
        setFormat("pdf")
      } else if (extension === "docx" || extension === "doc") {
        setFormat("docx")
      }
    }
  }

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setBulkFiles(filesArray)

      // Auto-detect format if all files have the same extension
      const extensions = filesArray.map((file) => file.name.split(".").pop()?.toLowerCase())
      const uniqueExtensions = [...new Set(extensions)]

      if (uniqueExtensions.length === 1) {
        if (uniqueExtensions[0] === "pdf") {
          setBulkFormat("pdf")
        } else if (uniqueExtensions[0] === "docx" || uniqueExtensions[0] === "doc") {
          setBulkFormat("docx")
        }
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !name || !description || !price || !category || !format) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    setUploadProgress(0)

    try {
      console.log("Starting document upload:", { name, description, price, category, format, file: file.name })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("format", format)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + 10
          return next > 90 ? 90 : next
        })
      }, 300)

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to upload document")
      }

      const document = await response.json()
      console.log("Document uploaded successfully:", document)

      setSuccess("Document uploaded successfully!")
      setName("")
      setDescription("")
      setPrice("")
      setCategory("")
      setFile(null)
      setFormat("")
      setUploadProgress(0)

      // Refresh document list
      fetchDocuments()
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (bulkFiles.length === 0 || !bulkCategory || !bulkFormat || !bulkBasePrice) {
      setError("Please fill in all fields and select files")
      return
    }

    setBulkUploading(true)
    setError(null)
    setSuccess(null)
    setBulkProgress(0)

    try {
      let successCount = 0

      for (let i = 0; i < bulkFiles.length; i++) {
        const file = bulkFiles[i]
        const fileName = file.name.split(".")[0] // Use filename as document name

        const formData = new FormData()
        formData.append("file", file)
        formData.append("name", fileName)
        formData.append("description", `${fileName} document`)

        // You can adjust pricing strategy here
        const filePrice = Number.parseFloat(bulkBasePrice)
        formData.append("price", filePrice.toString())

        formData.append("category", bulkCategory)
        formData.append("format", bulkFormat)

        const response = await fetch("/api/documents/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          successCount++
        }

        // Update progress
        setBulkProgress(Math.round(((i + 1) / bulkFiles.length) * 100))
      }

      setSuccess(`Bulk upload complete! ${successCount} of ${bulkFiles.length} documents uploaded successfully.`)
      setBulkFiles([])
      setBulkCategory("")
      setBulkFormat("")
      setBulkBasePrice("")

      // Refresh document list
      fetchDocuments()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setBulkUploading(false)
    }
  }

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents")
      if (!response.ok) {
        throw new Error("Failed to fetch documents")
      }

      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (err: any) {
      console.error("Error fetching documents:", err)
      // Don't show this error to the user, just log it
    }
  }

  const deleteDocument = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete document")
      }

      // Refresh document list
      fetchDocuments()
      setSuccess("Document deleted successfully!")
    } catch (err: any) {
      setError(err.message)
      console.error("Error deleting document:", err)
    }
  }

  // Bulk delete functions
  const toggleDocumentSelection = (id: string) => {
    setSelectedDocuments((prev) => {
      if (prev.includes(id)) {
        return prev.filter((docId) => docId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const toggleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(documents.map((doc) => doc.id))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedDocuments.length === 0) return

    setIsDeleting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/documents/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentIds: selectedDocuments }),
      })

      const contentType = response.headers.get("content-type")

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server. The operation may have partially succeeded.")
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete documents")
      }

      setSuccess(result.message || `Successfully deleted ${selectedDocuments.length} documents.`)
      setSelectedDocuments([])
      fetchDocuments()
      setIsDeleteDialogOpen(false)
    } catch (err: any) {
      console.error("Bulk delete error:", err)
      setError(err.message || "An error occurred while deleting documents")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8 flex justify-between items-center">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <div className="flex gap-4">
          <Link
            href="/admin/documents/streamlined"
            className="inline-flex items-center text-sm bg-teal-600 text-white px-3 py-1 rounded-md hover:bg-teal-700"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Streamlined Upload
          </Link>
          <Link
            href="/admin/documents/google-drive"
            className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700"
          >
            <CloudOff className="mr-2 h-4 w-4" />
            Google Drive
          </Link>
          <Link
            href="/admin/documents/zip-upload"
            className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700"
          >
            <FileArchive className="mr-2 h-4 w-4" />
            ZIP Upload
          </Link>
          <Link
            href="/admin/documents/csv-upload"
            className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            CSV Upload
          </Link>
          <Link href="/admin/bundles" className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700">
            <Package className="mr-2 h-4 w-4" />
            Manage Bundles
          </Link>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8">Document Management</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Tabs defaultValue="single">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Upload</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="single">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Document</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    {error && (
                      <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-800 text-sm flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
                        <div>{error}</div>
                      </div>
                    )}

                    {success && (
                      <div className="bg-green-50 p-3 rounded-md border border-green-200 text-green-800 text-sm">
                        {success}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Document Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="business">Business Formation</SelectItem>
                            <SelectItem value="contracts">Contracts</SelectItem>
                            <SelectItem value="employment">Employment</SelectItem>
                            <SelectItem value="realestate">Real Estate</SelectItem>
                            <SelectItem value="website">Website Policies</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file">Document File</Label>
                      <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Label htmlFor="file" className="cursor-pointer flex flex-col items-center">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm font-medium">
                            {file ? file.name : "Click to upload or drag and drop"}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">PDF or Word documents up to 10MB</span>
                        </Label>
                      </div>
                      {file && (
                        <p className="text-xs text-gray-500">
                          Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="format">Format</Label>
                      <Select value={format} onValueChange={setFormat} required>
                        <SelectTrigger id="format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="docx">DOCX</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {loading && uploadProgress > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm">Uploading: {uploadProgress}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
                      {loading ? "Uploading..." : "Upload Document"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="bulk">
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Upload Documents</CardTitle>
                </CardHeader>
                <form onSubmit={handleBulkSubmit}>
                  <CardContent className="space-y-4">
                    {error && (
                      <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-800 text-sm flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
                        <div>{error}</div>
                      </div>
                    )}

                    {success && (
                      <div className="bg-green-50 p-3 rounded-md border border-green-200 text-green-800 text-sm">
                        {success}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="bulkFiles">Select Multiple Files</Label>
                      <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                        <Input
                          id="bulkFiles"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleBulkFileChange}
                          multiple
                          className="hidden"
                        />
                        <Label htmlFor="bulkFiles" className="cursor-pointer flex flex-col items-center">
                          <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm font-medium">
                            {bulkFiles.length > 0
                              ? `${bulkFiles.length} files selected`
                              : "Click to upload multiple files"}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">PDF or Word documents up to 10MB each</span>
                        </Label>
                      </div>
                      {bulkFiles.length > 0 && (
                        <div className="text-xs text-gray-500 mt-2">
                          Selected files: {bulkFiles.map((f) => f.name).join(", ")}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bulkBasePrice">Base Price ($)</Label>
                        <Input
                          id="bulkBasePrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={bulkBasePrice}
                          onChange={(e) => setBulkBasePrice(e.target.value)}
                          required
                        />
                        <p className="text-xs text-gray-500">This price will be applied to all uploaded documents</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bulkCategory">Category</Label>
                        <Select value={bulkCategory} onValueChange={setBulkCategory} required>
                          <SelectTrigger id="bulkCategory">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="business">Business Formation</SelectItem>
                            <SelectItem value="contracts">Contracts</SelectItem>
                            <SelectItem value="employment">Employment</SelectItem>
                            <SelectItem value="realestate">Real Estate</SelectItem>
                            <SelectItem value="website">Website Policies</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bulkFormat">Format</Label>
                      <Select value={bulkFormat} onValueChange={setBulkFormat} required>
                        <SelectTrigger id="bulkFormat">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="docx">DOCX</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">All files should be the same format</p>
                    </div>

                    {bulkUploading && (
                      <div className="space-y-2">
                        <div className="text-sm">Uploading: {bulkProgress}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${bulkProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      disabled={bulkUploading || bulkFiles.length === 0}
                    >
                      {bulkUploading ? "Uploading..." : "Upload All Documents"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Document List</CardTitle>
            {documents.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={toggleSelectAll} className="text-xs">
                  {selectedDocuments.length === documents.length ? "Deselect All" : "Select All"}
                </Button>
                {selectedDocuments.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-xs"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete Selected ({selectedDocuments.length})
                  </Button>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`select-${doc.id}`}
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => toggleDocumentSelection(doc.id)}
                      />
                      <div>
                        <p className="font-medium">
                          <Link href={`/admin/documents/${doc.id}`} className="text-teal-600 hover:underline">
                            {doc.name}
                          </Link>
                        </p>
                        <p className="text-sm text-gray-500">
                          ${doc.price} • {doc.category}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteDocument(doc.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={fetchDocuments}>
              Refresh List
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedDocuments.length} document
              {selectedDocuments.length !== 1 ? "s" : ""}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Documents"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
