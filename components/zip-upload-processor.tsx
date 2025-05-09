"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileArchive, AlertCircle, Check, FileDown, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import JSZip from "jszip"
import Papa from "papaparse"

interface ZipUploadProcessorProps {
  onComplete?: (results: {
    total: number
    success: number
    failed: number
    documents: any[]
  }) => void
}

export function ZipUploadProcessor({ onComplete }: ZipUploadProcessorProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [processingStep, setProcessingStep] = useState<string>("")
  const [results, setResults] = useState<{
    total: number
    success: number
    failed: number
    documents: any[]
  } | null>(null)

  const generateTemplateZip = async () => {
    try {
      // Create a new JSZip instance
      const zip = new JSZip()

      // Create a CSV template
      const csvContent = [
        "name,description,price,category,format,filename",
        "LLC Operating Agreement,Essential agreement that outlines ownership structure,49,business,pdf,llc-operating-agreement.pdf",
        "Privacy Policy,GDPR compliant privacy policy for websites,29,website,docx,privacy-policy.docx",
        "Independent Contractor Agreement,Standard agreement for hiring contractors,39,contracts,pdf,contractor-agreement.pdf",
      ].join("\n")

      // Add the CSV to the zip
      zip.file("document-metadata.csv", csvContent)

      // Create sample placeholder documents
      const placeholderText = "This is a placeholder document. Replace with your actual document content."
      zip.file("llc-operating-agreement.pdf", placeholderText)
      zip.file("privacy-policy.docx", placeholderText)
      zip.file("contractor-agreement.pdf", placeholderText)

      // Add a README file
      const readmeContent = `
# Document Upload Template

This ZIP file contains:

1. document-metadata.csv - A template CSV file with document metadata
2. Sample placeholder document files

## Instructions:

1. Replace the placeholder files with your actual document files
2. Update the CSV with your document information
3. Make sure the 'filename' column in the CSV matches your actual filenames
4. Upload the ZIP file using the bulk upload tool

## CSV Format:

- name: Document name (e.g., "LLC Operating Agreement")
- description: Brief description of the document
- price: Price in dollars (e.g., 49.99)
- category: One of: business, contracts, employment, realestate, website
- format: File format (pdf or docx)
- filename: Exact filename of the document in this ZIP (e.g., "llc-agreement.pdf")
`
      zip.file("README.md", readmeContent)

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" })

      // Create a download link
      const link = document.createElement("a")
      link.href = URL.createObjectURL(content)
      link.download = "document-upload-template.zip"
      link.click()
    } catch (err) {
      console.error("Error generating template:", err)
      setError("Failed to generate template ZIP file")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "application/zip" || selectedFile.type === "application/x-zip-compressed") {
        setFile(selectedFile)
        setError(null)
        setResults(null)
      } else {
        setError("Please select a ZIP file")
        setFile(null)
      }
    }
  }

  const processZipFile = async () => {
    if (!file) {
      setError("Please select a ZIP file")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)
    setProcessingStep("Reading ZIP file...")

    try {
      // Read the ZIP file
      const zip = new JSZip()
      const zipContent = await zip.loadAsync(file)
      setProgress(10)
      setProcessingStep("Extracting files...")

      // Look for the CSV file
      let csvFile = null
      let csvContent = ""

      // Find the CSV file (case insensitive)
      for (const filename in zipContent.files) {
        if (filename.toLowerCase().endsWith(".csv")) {
          csvFile = zipContent.files[filename]
          break
        }
      }

      if (!csvFile) {
        throw new Error("No CSV file found in the ZIP. Please include a CSV file with document metadata.")
      }

      // Read the CSV content
      csvContent = await csvFile.async("string")
      setProgress(20)
      setProcessingStep("Parsing CSV data...")

      // Parse the CSV
      const parsedCsv = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
      })

      if (parsedCsv.errors.length > 0) {
        throw new Error(`CSV parsing error: ${parsedCsv.errors[0].message}`)
      }

      const documents = parsedCsv.data as any[]
      setProgress(30)
      setProcessingStep("Validating document entries...")

      // Validate required fields
      const requiredFields = ["name", "description", "price", "category", "format", "filename"]
      const missingFields = documents.flatMap((doc, index) => {
        const missing = requiredFields.filter((field) => !doc[field])
        return missing.length > 0 ? [`Row ${index + 2}: Missing ${missing.join(", ")}`] : []
      })

      if (missingFields.length > 0) {
        throw new Error(`CSV validation errors:\n${missingFields.join("\n")}`)
      }

      // Process each document
      const results = {
        total: documents.length,
        success: 0,
        failed: 0,
        documents: [] as any[],
      }

      setProcessingStep("Uploading documents...")

      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i]
        const filename = doc.filename.trim()

        // Find the file in the ZIP
        const docFile = zipContent.files[filename]

        if (!docFile) {
          console.error(`File not found in ZIP: ${filename}`)
          doc.status = "failed"
          doc.error = `File "${filename}" not found in ZIP`
          results.failed++
          results.documents.push(doc)
          continue
        }

        try {
          // Get file content as blob
          const fileContent = await docFile.async("blob")

          // Create form data for upload
          const formData = new FormData()
          formData.append("file", fileContent, filename)
          formData.append("name", doc.name)
          formData.append("description", doc.description)
          formData.append("price", doc.price)
          formData.append("category", doc.category)
          formData.append("format", doc.format)

          // Upload the document
          const response = await fetch("/api/documents/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Upload failed")
          }

          const uploadedDoc = await response.json()
          doc.status = "success"
          doc.id = uploadedDoc.id
          results.success++
        } catch (err: any) {
          console.error(`Error uploading ${filename}:`, err)
          doc.status = "failed"
          doc.error = err.message
          results.failed++
        }

        results.documents.push(doc)

        // Update progress (30% to 90%)
        setProgress(30 + Math.round(((i + 1) / documents.length) * 60))
      }

      setProgress(100)
      setProcessingStep("Upload complete!")
      setResults(results)

      if (onComplete) {
        onComplete(results)
      }
    } catch (err: any) {
      console.error("Error processing ZIP:", err)
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">ZIP Upload</h3>
          <p className="text-sm text-gray-500">Upload a ZIP file containing documents and metadata</p>
        </div>
        <Button variant="outline" onClick={generateTemplateZip} className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Download Template
        </Button>
      </div>

      <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
        <input
          id="zipFile"
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />
        <label htmlFor="zipFile" className="cursor-pointer flex flex-col items-center">
          <FileArchive className="h-12 w-12 text-gray-400 mb-2" />
          <span className="text-sm font-medium">{file ? file.name : "Click to upload ZIP file"}</span>
          <span className="text-xs text-gray-500 mt-1">ZIP file containing documents and CSV metadata</span>
        </label>
      </div>

      {file && (
        <div className="text-sm text-gray-600">
          Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}

      {isProcessing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{processingStep}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {results && (
        <Alert className={results.failed > 0 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}>
          <div className="flex gap-2">
            {results.failed > 0 ? (
              <Info className="h-4 w-4 text-amber-600" />
            ) : (
              <Check className="h-4 w-4 text-green-600" />
            )}
            <AlertTitle>Upload Results</AlertTitle>
          </div>
          <AlertDescription>
            <div className="mt-2">
              <p>
                Processed {results.total} documents: {results.success} successful, {results.failed} failed
              </p>
              {results.failed > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-sm">Failed uploads:</p>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {results.documents
                      .filter((doc) => doc.status === "failed")
                      .map((doc, idx) => (
                        <li key={idx}>
                          {doc.name} ({doc.filename}): {doc.error}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button onClick={processZipFile} disabled={!file || isProcessing} className="bg-teal-600 hover:bg-teal-700">
          {isProcessing ? "Processing..." : "Process ZIP File"}
        </Button>
      </div>
    </div>
  )
}
