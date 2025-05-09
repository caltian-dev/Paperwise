"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Package, Trash, AlertTriangle } from "lucide-react"

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tablesExist, setTablesExist] = useState(true)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [popular, setPopular] = useState(false)

  useEffect(() => {
    // Fetch documents and bundles when the component mounts
    Promise.all([fetchDocuments(), fetchBundles()])
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false))
  }, [])

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
    }
  }

  const fetchBundles = async () => {
    try {
      const response = await fetch("/api/bundles")
      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.error && errorData.error.includes("relation") && errorData.error.includes("does not exist")) {
          setTablesExist(false)
          return
        }
        throw new Error("Failed to fetch bundles")
      }

      const data = await response.json()
      setBundles(data.bundles || [])
    } catch (err: any) {
      console.error("Error fetching bundles:", err)
      // Check if the error is about missing tables
      if (err.message && err.message.includes("relation") && err.message.includes("does not exist")) {
        setTablesExist(false)
      }
    }
  }

  const deleteBundle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bundle?")) {
      return
    }

    try {
      const response = await fetch(`/api/bundles/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete bundle")
      }

      // Refresh bundle list
      fetchBundles()
      setSuccess("Bundle deleted successfully!")
    } catch (err: any) {
      setError(err.message)
      console.error("Error deleting bundle:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !description || !price || !category || selectedDocuments.length === 0) {
      setError("Please fill in all fields and select at least one document")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/bundles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price: Number.parseFloat(price),
          category,
          documentIds: selectedDocuments,
          popular,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create bundle")
      }

      setSuccess("Bundle created successfully!")
      setName("")
      setDescription("")
      setPrice("")
      setCategory("")
      setSelectedDocuments([])
      setPopular(false)

      // Refresh bundles list
      fetchBundles()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentToggle = (documentId: string) => {
    setSelectedDocuments((prev) => {
      if (prev.includes(documentId)) {
        return prev.filter((id) => id !== documentId)
      } else {
        return [...prev, documentId]
      }
    })
  }

  const calculateSavings = () => {
    if (!selectedDocuments.length || !price) return 0

    const totalDocumentPrice = selectedDocuments.reduce((total, docId) => {
      const doc = documents.find((d) => d.id === docId)
      return total + (doc ? doc.price : 0)
    }, 0)

    const bundlePrice = Number.parseFloat(price)
    const savings = totalDocumentPrice - bundlePrice
    const savingsPercentage = (savings / totalDocumentPrice) * 100

    return Math.round(savingsPercentage)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
      </div>
    )
  }

  if (!tablesExist) {
    return (
      <div className="container mx-auto py-12">
        <div className="mb-8">
          <Link href="/admin/documents" className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documents
          </Link>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Database Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              The bundle tables don't exist in your database yet. You need to initialize them before you can manage
              bundles.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
              <Link href="/admin/bundles/init">Initialize Bundle Tables</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8 flex justify-between items-center">
        <Link href="/admin/documents" className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Link>
        <Link href="/" className="text-sm text-gray-600 hover:text-teal-600">
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Bundle Management</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Bundle</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-800 text-sm">{error}</div>
              )}

              {success && (
                <div className="bg-green-50 p-3 rounded-md border border-green-200 text-green-800 text-sm">
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Bundle Name</Label>
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
                  <Label htmlFor="price">Bundle Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  {selectedDocuments.length > 0 && price && (
                    <p className="text-xs text-teal-600 mt-1">Savings: {calculateSavings()}% off individual prices</p>
                  )}
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

              <div className="flex items-center space-x-2">
                <Checkbox id="popular" checked={popular} onCheckedChange={(checked) => setPopular(!!checked)} />
                <Label htmlFor="popular">Mark as popular</Label>
              </div>

              <div className="space-y-2">
                <Label>Select Documents for Bundle</Label>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  {documents.length === 0 ? (
                    <p className="text-sm text-gray-500">No documents available. Add documents first.</p>
                  ) : (
                    <div className="space-y-2">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`doc-${doc.id}`}
                            checked={selectedDocuments.includes(doc.id)}
                            onCheckedChange={() => handleDocumentToggle(doc.id)}
                          />
                          <Label htmlFor={`doc-${doc.id}`} className="text-sm">
                            {doc.name} - ${doc.price}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Selected: {selectedDocuments.length} documents (Total value: $
                  {selectedDocuments.reduce((total, docId) => {
                    const doc = documents.find((d) => d.id === docId)
                    return total + (doc ? doc.price : 0)
                  }, 0)}
                  )
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
                {loading ? "Creating..." : "Create Bundle"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bundle List</CardTitle>
          </CardHeader>
          <CardContent>
            {bundles.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No bundles created yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bundles.map((bundle) => (
                  <div key={bundle.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{bundle.name}</p>
                      <p className="text-sm text-gray-500">
                        ${bundle.price} • {bundle.category} • {bundle.documents?.length || 0} documents
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteBundle(bundle.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={fetchBundles}>
              Refresh List
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
