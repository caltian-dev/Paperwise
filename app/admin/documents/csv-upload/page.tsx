"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, AlertCircle, FileSpreadsheet, Check, ExternalLink } from "lucide-react"
import { CsvTemplateGenerator } from "@/components/csv-template-generator"
import Papa from "papaparse"

export default function CsvUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [parseComplete, setParseComplete] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResults, setUploadResults] = useState<{
    total: number
    success: number
    failed: number
  }>({ total: 0, success: 0, failed: 0 })
  const [bundles, setBundles] = useState<any[]>([])

  useEffect(() => {
    // Fetch bundles when component mounts
    const fetchBundles = async () => {
      try {
        const response = await fetch("/api/bundles")
        if (response.ok) {
          const data = await response.json()
          setBundles(data.bundles || [])
        }
      } catch (error) {
        console.error("Error fetching bundles:", error)
      }
    }

    fetchBundles()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setParseComplete(false)
      setDocuments([])
      setError(null)
    }
  }

  const parseCsv = async () => {
    if (!file) {
      setError("Please select a CSV file")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const text = await file.text()

      // Parse CSV using PapaParse
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            throw new Error(`CSV parsing error: ${results.errors[0].message}`)
          }

          const parsedDocuments = results.data as any[]

          // Validate required fields
          const requiredFields = ["name", "description", "price", "category", "format"]
          const missingFields = parsedDocuments.flatMap((doc, index) => {
            const missing = requiredFields.filter((field) => !doc[field])
            return missing.length > 0 ? [`Row ${index + 2}: Missing ${missing.join(", ")}`] : []
          })

          if (missingFields.length > 0) {
            throw new Error(`CSV validation errors:\n${missingFields.join("\n")}`)
          }

          // Process bundle IDs
          parsedDocuments.forEach((doc) => {
            if (doc.bundleIds) {
              doc.bundleIds = doc.bundleIds.split(";").filter(Boolean)
            } else {
              doc.bundleIds = []
            }

            // Convert price to number
            if (doc.price) {
              doc.price = Number.parseFloat(doc.price)
            }
          })

          setDocuments(parsedDocuments)
          setParseComplete(true)
          setSuccess(`Successfully parsed ${parsedDocuments.length} documents from CSV`)
        },
        error: (error) => {
          throw new Error(`Failed to parse CSV: ${error.message}`)
        },
      })
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const uploadDocuments = async () => {
    if (documents.length === 0) {
      setError("No documents to upload")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    setUploadProgress(0)

    const results = {
      total: documents.length,
      success: 0,
      failed: 0,
    }

    try {
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i]

        try {
          // Determine if we're using a URL or metadata-only
          const endpoint = doc.url ? "/api/documents/from-url" : "/api/documents/metadata"

          const payload = {
            name: doc.name,
            description: doc.description,
            price: doc.price,
            category: doc.category,
            format: doc.format,
            url: doc.url || undefined,
            bundleIds: doc.bundleIds || [],
          }

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })

          if (!response.ok) {
            throw new Error(`Failed to upload ${doc.name}`)
          }

          results.success++
        } catch (err) {
          results.failed++
          console.error(`Error uploading ${doc.name}:`, err)
        }

        // Update progress
        setUploadProgress(Math.round(((i + 1) / documents.length) * 100))
      }

      setUploadResults(results)
      setSuccess(`Upload complete! ${results.success} of ${results.total} documents uploaded successfully.`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Get bundle name by ID
  const getBundleName = (bundleId: string) => {
    const bundle = bundles.find((b) => b.id === bundleId)
    return bundle ? bundle.name : bundleId
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <Link href="/admin/documents" className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">CSV Document Upload</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents via CSV</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-800 text-sm flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
                <div className="whitespace-pre-line">{error}</div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 p-3 rounded-md border border-green-200 text-green-800 text-sm flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 text-green-500" />
                <div>{success}</div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="csvFile">CSV File</Label>
                <CsvTemplateGenerator />
              </div>
              <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                <Input id="csvFile" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                <Label htmlFor="csvFile" className="cursor-pointer flex flex-col items-center">
                  <FileSpreadsheet className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium">{file ? file.name : "Click to upload CSV file"}</span>
                  <span className="text-xs text-gray-500 mt-1">CSV file with document metadata</span>
                </Label>
              </div>
              {file && (
                <p className="text-xs text-gray-500">
                  Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={parseCsv} disabled={!file || loading} className="bg-teal-600 hover:bg-teal-700">
                Parse CSV
              </Button>
            </div>

            {parseComplete && documents.length > 0 && (
              <div className="space-y-4 mt-6 border-t pt-4">
                <h3 className="font-medium">Documents to Upload</h3>
                <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Price</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-left p-2">Format</th>
                        <th className="text-left p-2">Source</th>
                        <th className="text-left p-2">Bundles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{doc.name}</td>
                          <td className="p-2">${doc.price}</td>
                          <td className="p-2">{doc.category}</td>
                          <td className="p-2">{doc.format}</td>
                          <td className="p-2">
                            {doc.url ? (
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-teal-600 hover:text-teal-700"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                URL
                              </a>
                            ) : (
                              "Metadata only"
                            )}
                          </td>
                          <td className="p-2">
                            {doc.bundleIds && doc.bundleIds.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {doc.bundleIds.map((id: string, i: number) => (
                                  <span key={i} className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                                    {getBundleName(id)}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              "None"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {loading && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm">Uploading: {uploadProgress}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {uploadResults.total > 0 && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium mb-1">Upload Results</h4>
                    <ul className="text-sm space-y-1">
                      <li>Total documents: {uploadResults.total}</li>
                      <li className="text-green-600">Successfully uploaded: {uploadResults.success}</li>
                      {uploadResults.failed > 0 && (
                        <li className="text-red-600">Failed uploads: {uploadResults.failed}</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={uploadDocuments}
                    disabled={loading || documents.length === 0}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {loading ? "Uploading..." : "Upload Documents"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSV Upload Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">How to Use CSV Upload</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Download the CSV template using the button above</li>
                <li>
                  Fill in your document details in the spreadsheet:
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
                      <strong>url</strong>: (Optional) URL to the document (Google Drive, etc.)
                    </li>
                    <li>
                      <strong>bundleIds</strong>: (Optional) Bundle IDs separated by semicolons
                    </li>
                  </ul>
                </li>
                <li>Save the file as CSV</li>
                <li>Upload the CSV file using the form</li>
                <li>Click "Parse CSV" to validate the data</li>
                <li>Review the parsed documents</li>
                <li>Click "Upload Documents" to add them to your catalog</li>
              </ol>
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mt-4">
              <h4 className="font-medium text-blue-800 mb-1">Using Google Drive URLs</h4>
              <p className="text-sm text-blue-700 mb-2">
                You can use Google Drive URLs in the "url" column to reference documents stored in Google Drive.
              </p>
              <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                <li>Upload your document to Google Drive</li>
                <li>Right-click the file and select "Get link"</li>
                <li>Make sure the link is set to "Anyone with the link can view"</li>
                <li>Copy the link and paste it in the "url" column of your CSV</li>
              </ol>
              <p className="text-sm text-blue-700 mt-2">
                Example URL format: https://drive.google.com/file/d/FILE_ID/view
              </p>
            </div>

            <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mt-4">
              <h4 className="font-medium text-amber-800 mb-1">Bundle Assignment</h4>
              <p className="text-sm text-amber-700">
                To assign documents to bundles, add the bundle IDs in the "bundleIds" column, separated by semicolons.
                For example: "bundle_id1;bundle_id2"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
