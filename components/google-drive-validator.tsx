"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react"

export function GoogleDriveValidator() {
  const [url, setUrl] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [result, setResult] = useState<{
    valid: boolean
    fileId?: string
    directUrl?: string
    error?: string
  } | null>(null)

  // Extract Google Drive file ID
  const extractGoogleDriveFileId = (url: string): string | null => {
    // Match patterns like https://drive.google.com/file/d/FILE_ID/view
    const match = url.match(/\/file\/d\/([^/]+)\//)
    return match ? match[1] : null
  }

  // Get direct download URL from Google Drive
  const getGoogleDriveDirectUrl = (fileId: string): string => {
    return `https://drive.google.com/uc?export=download&id=${fileId}`
  }

  const validateUrl = () => {
    if (!url) return

    setIsValidating(true)
    setResult(null)

    try {
      // Check if it's a Google Drive URL
      if (!url.includes("drive.google.com")) {
        setResult({
          valid: false,
          error: "Not a Google Drive URL",
        })
        setIsValidating(false)
        return
      }

      // Extract file ID
      const fileId = extractGoogleDriveFileId(url)
      if (!fileId) {
        setResult({
          valid: false,
          error: "Could not extract file ID from URL",
        })
        setIsValidating(false)
        return
      }

      // Get direct URL
      const directUrl = getGoogleDriveDirectUrl(fileId)

      // Validate by trying to fetch headers
      fetch(directUrl, { method: "HEAD" })
        .then((response) => {
          if (response.ok) {
            setResult({
              valid: true,
              fileId,
              directUrl,
            })
          } else {
            setResult({
              valid: false,
              fileId,
              error: `File not accessible (Status: ${response.status}). Make sure sharing is set to "Anyone with the link can view".`,
            })
          }
        })
        .catch((err) => {
          setResult({
            valid: false,
            fileId,
            error: "Could not validate file access. CORS may be preventing validation.",
          })
        })
        .finally(() => {
          setIsValidating(false)
        })
    } catch (err: any) {
      setResult({
        valid: false,
        error: err.message || "Failed to validate URL",
      })
      setIsValidating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Drive URL Validator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">
          Enter a Google Drive URL to validate and get the direct download URL for your CSV.
        </p>

        <div className="space-y-2">
          <Label htmlFor="driveUrl">Google Drive URL</Label>
          <div className="flex gap-2">
            <Input
              id="driveUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="flex-1"
            />
            <Button onClick={validateUrl} disabled={!url || isValidating} className="bg-teal-600 hover:bg-teal-700">
              {isValidating ? "Checking..." : "Validate"}
            </Button>
          </div>
        </div>

        {result && (
          <div
            className={`p-4 rounded-md ${
              result.valid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.valid ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${result.valid ? "text-green-800" : "text-red-800"}`}>
                  {result.valid ? "Valid Google Drive URL" : "Invalid Google Drive URL"}
                </p>
                {result.valid ? (
                  <div className="mt-2 space-y-2 text-sm text-green-700">
                    <p>File ID: {result.fileId}</p>
                    <div className="flex items-center">
                      <span className="mr-2">Direct URL:</span>
                      <a
                        href={result.directUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 flex items-center"
                      >
                        Open <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                    <p className="text-xs bg-green-100 p-2 rounded">
                      Use this URL in your CSV file: {result.directUrl}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-red-700">{result.error}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-xs text-gray-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          Make sure your Google Drive file is set to "Anyone with the link can view"
        </div>
        <Button variant="outline" size="sm" onClick={() => window.open(url, "_blank")} disabled={!url}>
          <FileText className="h-4 w-4 mr-1" />
          Open URL
        </Button>
      </CardFooter>
    </Card>
  )
}
