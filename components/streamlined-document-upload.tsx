"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, X, Upload, FileText, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Papa from "papaparse"
import { Download, FileSpreadsheet } from "lucide-react"

const CATEGORIES = [
  { value: "business", label: "Business Formation" },
  { value: "contracts", label: "Contracts" },
  { value: "employment", label: "Employment" },
  { value: "realestate", label: "Real Estate" },
  { value: "website", label: "Website Policies" },
]

export function StreamlinedDocumentUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadStatus, setUploadStatus] = useState<Record<string, "pending" | "success" | "error">>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})
  const [uploadResults, setUploadResults] = useState<any[]>([])
  const [defaultCategory, setDefaultCategory] = useState("")
  const [defaultPrice, setDefaultPrice] = useState("")
  const [batchMode, setBatchMode] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [csvFile, setCsvFile] = useState<File | null>(null)

  // File metadata state
  const [metadata, setMetadata] = useState<
    Record<string, { name: string; description: string; price: string; category: string }>
  >({})

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Filter out any non-document files
      const docFiles = acceptedFiles.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/msword",
      )

      // Initialize metadata for new files
      const newMetadata = { ...metadata }
      docFiles.forEach((file) => {
        if (!newMetadata[file.name]) {
          // Extract a reasonable name from the filename
          const fileName = file.name.split(".")[0]
          const formattedName = fileName
            .split(/[-_]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")

          newMetadata[file.name] = {
            name: formattedName,
            description: `${formattedName} document for your business needs.`,
            price: defaultPrice,
            category: defaultCategory,
          }
        }
      })

      setMetadata(newMetadata)
      setFiles((prevFiles) => {
        // Combine existing files with new ones, avoiding duplicates
        const fileMap = new Map(prevFiles.map((file) => [file.name, file]))
        docFiles.forEach((file) => fileMap.set(file.name, file))
        return Array.from(fileMap.values())
      })
    },
    [metadata, defaultCategory, defaultPrice],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
    },
  })

  const removeFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName))

    // Also remove metadata
    const newMetadata = { ...metadata }
    delete newMetadata[fileName]
    setMetadata(newMetadata)

    // Remove from progress and status if exists
    const newProgress = { ...uploadProgress }
    const newStatus = { ...uploadStatus }
    const newErrors = { ...uploadErrors }

    delete newProgress[fileName]
    delete newStatus[fileName]
    delete newErrors[fileName]

    setUploadProgress(newProgress)
    setUploadStatus(newStatus)
    setUploadErrors(newErrors)
  }

  const updateMetadata = (fileName: string, field: string, value: string) => {
    setMetadata((prev) => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [field]: value,
      },
    }))
  }

  const applyToAll = (field: string, value: string) => {
    const newMetadata = { ...metadata }
    files.forEach((file) => {
      if (newMetadata[file.name]) {
        newMetadata[file.name][field as keyof (typeof newMetadata)[typeof file.name]] = value
      }
    })
    setMetadata(newMetadata)
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    setUploadResults([])

    // Initialize progress and status for all files
    const initialProgress: Record<string, number> = {}
    const initialStatus: Record<string, "pending" | "success" | "error"> = {}
    files.forEach((file) => {
      initialProgress[file.name] = 0
      initialStatus[file.name] = "pending"
    })

    setUploadProgress(initialProgress)
    setUploadStatus(initialStatus)
    setUploadErrors({})

    const results = []
    let completedCount = 0

    for (const file of files) {
      try {
        // Skip files without complete metadata
        const fileMetadata = metadata[file.name]
        if (
          !fileMetadata ||
          !fileMetadata.name ||
          !fileMetadata.description ||
          !fileMetadata.price ||
          !fileMetadata.category
        ) {
          setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }))
          setUploadErrors((prev) => ({ ...prev, [file.name]: "Incomplete metadata" }))
          continue
        }

        // Determine format from file extension
        const format = file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "docx"

        // Create form data
        const formData = new FormData()
        formData.append("file", file)
        formData.append("name", fileMetadata.name)
        formData.append("description", fileMetadata.description)
        formData.append("price", fileMetadata.price)
        formData.append("category", fileMetadata.category)
        formData.append("format", format)

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const current = prev[file.name] || 0
            if (current < 90) {
              return { ...prev, [file.name]: current + 10 }
            }
            return prev
          })
        }, 300)

        // Upload the file
        const response = await fetch("/api/documents/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Upload failed")
        }

        const result = await response.json()
        results.push(result)

        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))
        setUploadStatus((prev) => ({ ...prev, [file.name]: "success" }))
      } catch (error: any) {
        console.error(`Error uploading ${file.name}:`, error)
        setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }))
        setUploadErrors((prev) => ({ ...prev, [file.name]: error.message }))
      }

      // Update overall progress
      completedCount++
      setOverallProgress(Math.round((completedCount / files.length) * 100))
    }

    setUploadResults(results)
    setUploading(false)
  }

  const resetForm = () => {
    setFiles([])
    setMetadata({})
    setUploadProgress({})
    setUploadStatus({})
    setUploadErrors({})
    setUploadResults([])
    setOverallProgress(0)
  }

  const allUploaded = files.length > 0 && files.every((file) => uploadStatus[file.name] === "success")
  const hasErrors = files.some((file) => uploadStatus[file.name] === "error")

  const handleCsvImport = async (file: File) => {
    setCsvFile(file)

    try {
      const text = await file.text()
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && Array.isArray(results.data)) {
            const newMetadata = { ...metadata }
            let matchCount = 0

            results.data.forEach((row: any) => {
              if (row.filename && (row.price || row.category)) {
                // Try to find a matching file
                const matchingFile = files.find(
                  (f) =>
                    f.name.toLowerCase() === row.filename.toLowerCase() ||
                    f.name.toLowerCase().includes(row.filename.toLowerCase().replace(/\.[^/.]+$/, "")),
                )

                if (matchingFile) {
                  matchCount++
                  if (!newMetadata[matchingFile.name]) {
                    newMetadata[matchingFile.name] = {
                      name: metadata[matchingFile.name]?.name || matchingFile.name.split(".")[0],
                      description:
                        metadata[matchingFile.name]?.description ||
                        `${matchingFile.name.split(".")[0]} document for your business needs.`,
                      price: row.price || metadata[matchingFile.name]?.price || defaultPrice,
                      category: row.category || metadata[matchingFile.name]?.category || defaultCategory,
                    }
                  } else {
                    if (row.price) newMetadata[matchingFile.name].price = row.price
                    if (row.category) newMetadata[matchingFile.name].category = row.category
                  }
                }
              }
            })

            setMetadata(newMetadata)
            alert(`CSV imported successfully. Matched ${matchCount} files.`)
          }
        },
        error: (error) => {
          console.error("CSV parsing error:", error)
          alert("Error parsing CSV file. Please check the format.")
        },
      })
    } catch (error) {
      console.error("Error reading CSV file:", error)
      alert("Error reading CSV file.")
    }
  }

  const generateCsvTemplate = () => {
    const csvContent = [["filename", "price", "category"], ...files.map((file) => [file.name, "", ""])]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document_pricing_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Batch settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Quick Settings</h3>
                <p className="text-sm text-gray-500">Apply these settings to all uploaded documents</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="w-full sm:w-40">
                  <Select
                    value={defaultCategory}
                    onValueChange={(value) => {
                      setDefaultCategory(value)
                      if (value && files.length > 0) {
                        applyToAll("category", value)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Default Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-32">
                  <Input
                    type="number"
                    placeholder="Default Price"
                    value={defaultPrice}
                    onChange={(e) => {
                      setDefaultPrice(e.target.value)
                      if (e.target.value && files.length > 0) {
                        applyToAll("price", e.target.value)
                      }
                    }}
                    min="0"
                    step="0.01"
                  />
                </div>
                <Button variant="outline" onClick={() => setBatchMode(!batchMode)} className="w-full sm:w-auto">
                  {batchMode ? "Individual Edit" : "Batch Edit"}
                </Button>
              </div>
            </div>

            {/* CSV Import Section */}
            {files.length > 0 && (
              <div className="border-t pt-4 mt-2">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">CSV Import</h4>
                    <p className="text-sm text-gray-500">Import pricing and categories from a CSV file</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" onClick={generateCsvTemplate} className="w-full sm:w-auto">
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                    <div className="relative w-full sm:w-auto">
                      <Input
                        type="file"
                        accept=".csv"
                        id="csv-upload"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleCsvImport(file)
                        }}
                      />
                      <Button variant="secondary" size="sm" className="w-full">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Import CSV
                      </Button>
                    </div>
                  </div>
                  {csvFile && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Imported:</span> {csvFile.name}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-teal-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-1">Drag & drop documents here</h3>
        <p className="text-sm text-gray-500">or click to browse files</p>
        <p className="text-xs text-gray-400 mt-2">Supports PDF and Word documents</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Documents ({files.length})</h3>
            <div className="flex gap-2">
              {!uploading && (
                <>
                  <Button variant="outline" size="sm" onClick={resetForm}>
                    Clear All
                  </Button>
                  <Button
                    onClick={uploadFiles}
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>Upload All</>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Overall progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall progress</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          )}

          {/* File cards */}
          <div className="grid gap-4">
            {files.map((file) => (
              <Card
                key={file.name}
                className={`overflow-hidden ${
                  uploadStatus[file.name] === "success"
                    ? "border-green-200 bg-green-50"
                    : uploadStatus[file.name] === "error"
                      ? "border-red-200 bg-red-50"
                      : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                    {/* Header with file info and status */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB •
                            {file.name.toLowerCase().endsWith(".pdf") ? " PDF" : " Word"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {uploadStatus[file.name] === "success" && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            <Check className="h-3 w-3 mr-1" /> Uploaded
                          </Badge>
                        )}
                        {uploadStatus[file.name] === "error" && (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                            <X className="h-3 w-3 mr-1" /> Failed
                          </Badge>
                        )}
                        {!uploading && uploadStatus[file.name] !== "success" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.name)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    {(uploading || uploadStatus[file.name] === "success") && (
                      <Progress
                        value={uploadProgress[file.name] || 0}
                        className="h-1"
                        indicatorClassName={uploadStatus[file.name] === "error" ? "bg-red-500" : undefined}
                      />
                    )}

                    {/* Error message */}
                    {uploadStatus[file.name] === "error" && uploadErrors[file.name] && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Upload Failed</AlertTitle>
                        <AlertDescription>{uploadErrors[file.name]}</AlertDescription>
                      </Alert>
                    )}

                    {/* Metadata form - only show if not in batch mode or if in batch mode but not uploaded yet */}
                    {(!batchMode || (batchMode && !uploadStatus[file.name])) &&
                      !uploading &&
                      uploadStatus[file.name] !== "success" && (
                        <div className="grid gap-4 mt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`name-${file.name}`}>Document Name</Label>
                              <Input
                                id={`name-${file.name}`}
                                value={metadata[file.name]?.name || ""}
                                onChange={(e) => updateMetadata(file.name, "name", e.target.value)}
                                placeholder="Document name"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`category-${file.name}`}>Category</Label>
                                <Select
                                  value={metadata[file.name]?.category || ""}
                                  onValueChange={(value) => updateMetadata(file.name, "category", value)}
                                >
                                  <SelectTrigger id={`category-${file.name}`}>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {CATEGORIES.map((category) => (
                                      <SelectItem key={category.value} value={category.value}>
                                        {category.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`price-${file.name}`}>Price ($)</Label>
                                <Input
                                  id={`price-${file.name}`}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={metadata[file.name]?.price || ""}
                                  onChange={(e) => updateMetadata(file.name, "price", e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`description-${file.name}`}>Description</Label>
                            <Textarea
                              id={`description-${file.name}`}
                              value={metadata[file.name]?.description || ""}
                              onChange={(e) => updateMetadata(file.name, "description", e.target.value)}
                              placeholder="Document description"
                              rows={2}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Batch edit form */}
      {batchMode && files.length > 0 && !uploading && !allUploaded && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-medium">Batch Edit</h3>
            <p className="text-sm text-gray-500">Edit metadata for all documents at once</p>

            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch-category">Category</Label>
                  <Select
                    value={defaultCategory}
                    onValueChange={(value) => {
                      setDefaultCategory(value)
                      applyToAll("category", value)
                    }}
                  >
                    <SelectTrigger id="batch-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch-price">Price ($)</Label>
                  <Input
                    id="batch-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={defaultPrice}
                    onChange={(e) => {
                      setDefaultPrice(e.target.value)
                      applyToAll("price", e.target.value)
                    }}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch-description">Description Template</Label>
                <Textarea
                  id="batch-description"
                  placeholder="Enter a description template. Use {name} to insert the document name."
                  rows={2}
                  onChange={(e) => {
                    const template = e.target.value
                    files.forEach((file) => {
                      const name = metadata[file.name]?.name || file.name.split(".")[0]
                      const description = template.replace(/{name}/g, name)
                      updateMetadata(file.name, "description", description)
                    })
                  }}
                />
                <p className="text-xs text-gray-500">Example: "{"{name}"} document for your business needs."</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload complete summary */}
      {allUploaded && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Upload Complete</AlertTitle>
          <AlertDescription>
            Successfully uploaded {uploadResults.length} document{uploadResults.length !== 1 ? "s" : ""}.
          </AlertDescription>
          <div className="flex justify-end mt-4">
            <Button onClick={resetForm} className="bg-teal-600 hover:bg-teal-700 text-white">
              Upload More Documents
            </Button>
          </div>
        </Alert>
      )}

      {/* Error summary */}
      {hasErrors && !uploading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Issues</AlertTitle>
          <AlertDescription>
            Some documents failed to upload. Please check the errors above and try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
